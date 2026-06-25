// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// // Generate JWT
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: "7d",
//   });
// };

// // @route   POST /api/auth/signup
// const signup = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Check user exists
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create user
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @route   POST /api/auth/login
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });

//     if (user && (await bcrypt.compare(password, user.password))) {
//       res.json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         token: generateToken(user._id),
//       });
//     } else {
//       res.status(401).json({ message: "Invalid credentials" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { signup, login };

const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const crypto = require("crypto");

const nodemailer = require("nodemailer");

const {
OAuth2Client,
} = require("google-auth-library");

const client = new OAuth2Client(
process.env.GOOGLE_CLIENT_ID
);

// JWT
const generateToken = (id) => {
return jwt.sign(
{ id },
process.env.JWT_SECRET,
{
expiresIn: "7d",
}
);
};

// EMAIL TRANSPORTER
const transporter =
nodemailer.createTransport({

  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

});

transporter.verify(
  function (error, success) {

    if (error) {

      console.log(
        "SMTP ERROR:",
        error
      );

    } else {

      console.log(
        "SMTP READY"
      );

    }

  }
);

// ==============================
// SIGNUP
// ==============================
const signup = async (
req,
res
) => {
try {
const {
name,
email,
password,
} = req.body;

const userExists =
  await User.findOne({
    email,
  });

if (userExists) {
  return res.status(400).json({
    message:
      "User already exists",
  });
}

const salt =
  await bcrypt.genSalt(10);

const hashedPassword =
  await bcrypt.hash(
    password,
    salt
  );

const user =
  await User.create({
    name,
    email,
    password:
      hashedPassword,
  });

// WELCOME EMAIL
await transporter.sendMail({
  from:
    process.env.EMAIL_USER,

  to: email,

  subject:
    "Welcome to AI Interview Platform",

  html: `
    <h2>Welcome ${name}</h2>
    <p>Your account has been created successfully.</p>
  `,
});

res.status(201).json({
  _id: user._id,
  name: user.name,
  email: user.email,
  token:
    generateToken(
      user._id
    ),
});

} catch (error) {
res.status(500).json({
message:
error.message,
});
}
};

// ==============================
// LOGIN
// ==============================
const login = async (
req,
res
) => {
try {
const {
email,
password,
} = req.body;

const user =
  await User.findOne({
    email,
  });

if (
  user &&
  user.password &&
  (await bcrypt.compare(
    password,
    user.password
  ))
) {
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token:
      generateToken(
        user._id
      ),
  });

} else {
  res.status(401).json({
    message:
      "Invalid credentials",
  });
}

} catch (error) {
res.status(500).json({
message:
error.message,
});
}
};

// ==============================
// GOOGLE LOGIN
// ==============================
const googleLogin =
async (req, res) => {
try {
    
  const { token } =
    req.body;

  const ticket =
    await client.verifyIdToken({
      idToken: token,
      audience:
        process.env
          .GOOGLE_CLIENT_ID,
    });

  const payload =
    ticket.getPayload();

  const {
    sub,
    email,
    name,
  } = payload;

  let user =
    await User.findOne({
      email,
    });

  if (!user) {

    user =
      await User.create({
        name,
        email,
        provider:
          "google",
        googleId: sub,
      });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token:
      generateToken(
        user._id
      ),
  });

} catch (error) {
  res.status(500).json({
    message:
      "Google login failed",
  });
}

};

// ==============================
// FORGOT PASSWORD
// ==============================
const forgotPassword =
async (req, res) => {
try {

  const { email } =
    req.body;

  const user =
    await User.findOne({
      email,
    });

  if (!user) {
    return res.status(404).json({
      message:
        "User not found",
    });
  }

  const resetToken =
    crypto
      .randomBytes(32)
      .toString("hex");

  user.resetPasswordToken =
    resetToken;

  user.resetPasswordExpire =
    Date.now() +
    15 * 60 * 1000;

  await user.save();

  const resetURL =
    `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  await transporter.sendMail({
    from:
      process.env.EMAIL_USER,

    to: email,

    subject:
      "Password Reset",

    html: `
      <h2>Password Reset</h2>
      <p>Click below link:</p>
      <a href="${resetURL}">
        Reset Password
      </a>
    `,
  });

  res.json({
    message:
      "Reset email sent",
  });

} catch (error) {

  console.error(
    "FORGOT PASSWORD ERROR:",
    error
  );

  res.status(500).json({
    message: error.message,
  });

}

};

// ==============================
// RESET PASSWORD
// ==============================
const resetPassword =
async (req, res) => {
try {
    
  const { token } =
    req.params;

  const { password } =
    req.body;

  const user =
    await User.findOne({
      resetPasswordToken:
        token,

      resetPasswordExpire:
        { $gt: Date.now() },
    });

  if (!user) {
    return res.status(400).json({
      message:
        "Invalid or expired token",
    });
  }

  const salt =
    await bcrypt.genSalt(10);

  user.password =
    await bcrypt.hash(
      password,
      salt
    );

  user.resetPasswordToken =
    null;

  user.resetPasswordExpire =
    null;

  await user.save();

  res.json({
    message:
      "Password reset successful",
  });

} catch (error) {
  res.status(500).json({
    message:
      error.message,
  });
}

};

module.exports = {
signup,
login,
googleLogin,
forgotPassword,
resetPassword,
};

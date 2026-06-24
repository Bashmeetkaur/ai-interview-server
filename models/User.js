const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false, // Not required for Google users
    },
    provider: { 
      type: String, 
      enum: ["local", "google"], 
      default: "local", 
    }, 
    googleId: 
    { 
      type: String, 
      default: null, 
    }, 
    resetPasswordToken: 
    { 
      type: String, 
      default: null, 
    }, 
    resetPasswordExpire: 
    { 
      type: Date, 
      default: null, 
    },
  },

  { timestamps: true }
  
);

module.exports = mongoose.model("User", userSchema);
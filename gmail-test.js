
require("dotenv").config();

const { google } = require("googleapis");

async function main() {
  const required = [
    "GMAIL_CLIENT_ID",
    "GMAIL_CLIENT_SECRET",
    "GMAIL_REFRESH_TOKEN",
  ];

  const missing = required.filter(
    (key) => !process.env[key]
  );

  if (missing.length) {
    throw new Error(
      `Missing environment variables: ${missing.join(", ")}`
    );
  }

  const sender = "trioit36@gmail.com";
  const recipient = process.env.GMAIL_TEST_TO;

  if (!recipient) {
    throw new Error(
      "Add GMAIL_TEST_TO to server/.env with your own email address."
    );
  }

  const auth = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    "http://localhost:5000/api/auth/gmail/callback"
  );

  auth.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });

  const gmail = google.gmail({
    version: "v1",
    auth,
  });

  const message = [
    `From: AI Interview Platform <${sender}>`,
    `To: ${recipient}`,
    "Subject: Gmail API test - AI Interview Platform",
    "Content-Type: text/plain; charset=utf-8",
    "",
    "Success! Gmail API email sending is working.",
    "This is a test email from your AI Interview Platform.",
  ].join("\r\n");

  const raw = Buffer.from(message).toString("base64url");

  const result = await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });

  console.log("Email sent successfully!");
  console.log("Gmail message ID:", result.data.id);
}

main().catch((error) => {
  console.error("Gmail test failed.");

  if (error.response?.data) {
    console.error(
      JSON.stringify(error.response.data, null, 2)
    );
  } else {
    console.error(error.message);
  }

  process.exitCode = 1;
});

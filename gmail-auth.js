
require("dotenv").config();

const http = require("http");
const { google } = require("googleapis");

const REDIRECT_URI =
  "http://localhost:5000/api/auth/gmail/callback";

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  REDIRECT_URI
);

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.send",
];

async function main() {
  if (
    !process.env.GMAIL_CLIENT_ID ||
    !process.env.GMAIL_CLIENT_SECRET
  ) {
    throw new Error(
      "Missing GMAIL_CLIENT_ID or GMAIL_CLIENT_SECRET in server/.env"
    );
  }

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });

  const server = http.createServer(async (req, res) => {
    const requestUrl = new URL(
      req.url,
      REDIRECT_URI
    );

    if (
      requestUrl.pathname !==
      "/api/auth/gmail/callback"
    ) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const error = requestUrl.searchParams.get("error");
    const code = requestUrl.searchParams.get("code");

    if (error || !code) {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Authorization was not completed.");
      console.error("Google authorization error:", error);
      server.close();
      return;
    }

    try {
      const { tokens } =
        await oauth2Client.getToken(code);

      if (!tokens.refresh_token) {
        throw new Error(
          "No refresh token returned. Run authorization again with consent."
        );
      }

      res.writeHead(200, {
        "Content-Type": "text/plain",
      });
      res.end(
        "Gmail authorization successful. You can close this tab."
      );

      console.log("\nAuthorization successful.");
      console.log(
        "\nSave this value privately as GMAIL_REFRESH_TOKEN in server/.env:\n"
      );
      console.log(tokens.refresh_token);
      console.log(
        "\nDo not share this token or commit it to Git."
      );
    } catch (err) {
      console.error("Token exchange failed:", err.message);

      if (!res.headersSent) {
        res.writeHead(500, {
          "Content-Type": "text/plain",
        });
        res.end(
          "Could not complete authorization. Check your local terminal."
        );
      }
    } finally {
      server.close();
    }
  });

  server.listen(5000, "localhost", () => {
    console.log(
      "Temporary callback server listening on port 5000."
    );
    console.log(
      "\nOpen this URL in your browser to authorize Gmail:\n"
    );
    console.log(authUrl);
    console.log(
      "\nKeep this terminal open until authorization finishes."
    );
  });

  server.on("error", (err) => {
    console.error(
      "Could not start callback server:",
      err.message
    );
    console.error(
      "If port 5000 is already in use, stop your local backend and try again."
    );
  });
}

main().catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
});

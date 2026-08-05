const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const { uploadAudio } = require("../controllers/uploadController");

const { protect } = require("../middleware/authMiddleware");

router.post(
  "/audio",
  protect,
  upload.single("audio"),
  uploadAudio
);

module.exports = router;
const { PutObjectCommand } = require("@aws-sdk/client-s3");

const { v4: uuidv4 } = require("uuid");

const s3 = require("../config/s3");

const uploadAudio = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        message: "No audio file uploaded",
      });
    }

    const fileName = `voice-recordings/${uuidv4()}.webm`;

    const command = new PutObjectCommand({

      Bucket: process.env.AWS_BUCKET_NAME,

      Key: fileName,

      Body: req.file.buffer,

      ContentType: req.file.mimetype,

    });

    await s3.send(command);

    const audioUrl =
      `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    res.status(200).json({
      message: "Audio uploaded successfully",
      audioUrl,
    });

  } 
  catch (error) {

  console.error("UPLOAD ERROR:", error);

  res.status(500).json({

    message: "Audio upload failed",

    error: error.message,

  });

}
};

module.exports = {
  uploadAudio,
};
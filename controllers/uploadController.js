const {
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const { v4: uuidv4 } = require("uuid");

const ffmpegPath = require("ffmpeg-static");

const { spawn } = require("child_process");

const s3 = require("../config/s3");


const convertWebMToMP3 = (inputBuffer) => {
  return new Promise((resolve, reject) => {

    const ffmpeg = spawn(ffmpegPath, [
      "-i",
      "pipe:0",

      "-f",
      "mp3",

      "-acodec",
      "libmp3lame",

      "-ab",
      "128k",

      "pipe:1",
    ]);

    const chunks = [];
    const errorChunks = [];

    ffmpeg.stdout.on("data", (chunk) => {
      chunks.push(chunk);
    });

    ffmpeg.stderr.on("data", (chunk) => {
      errorChunks.push(chunk);
    });

    ffmpeg.on("error", (error) => {
      reject(error);
    });

    ffmpeg.on("close", (code) => {

      if (code !== 0) {

        const errorMessage =
          Buffer.concat(errorChunks).toString();

        reject(
          new Error(
            `FFmpeg conversion failed: ${errorMessage}`
          )
        );

        return;
      }

      resolve(
        Buffer.concat(chunks)
      );
    });

    ffmpeg.stdin.write(inputBuffer);

    ffmpeg.stdin.end();
  });
};


const uploadAudio = async (req, res) => {

  try {

    if (!req.file) {

      return res.status(400).json({
        message: "No audio file uploaded",
      });

    }

    console.log("Original audio:");
    console.log("Mimetype:", req.file.mimetype);
    console.log("Size:", req.file.size);


    // ================================
    // Convert WebM → MP3
    // ================================

    const mp3Buffer =
      await convertWebMToMP3(
        req.file.buffer
      );

    console.log(
      "MP3 conversion successful"
    );

    console.log(
      "MP3 size:",
      mp3Buffer.length
    );


    // ================================
    // Upload MP3 to S3
    // ================================

    const fileName =
      `voice-recordings/${uuidv4()}.mp3`;


    const command =
      new PutObjectCommand({

        Bucket:
          process.env.AWS_BUCKET_NAME,

        Key:
          fileName,

        Body:
          mp3Buffer,

        ContentType:
          "audio/mpeg",

      });


    await s3.send(command);


    // ================================
    // Generate signed playback URL
    // ================================

    const audioUrl =
      await getSignedUrl(
        s3,

        new GetObjectCommand({

          Bucket:
            process.env.AWS_BUCKET_NAME,

          Key:
            fileName,

        }),

        {
          expiresIn: 3600,
        }
      );


    console.log(
      "MP3 uploaded to S3"
    );

    console.log(
      "Signed audio URL:",
      audioUrl
    );


    // ================================
    // Response
    // ================================

    res.status(200).json({

      message:
        "Audio converted and uploaded successfully",

      audioUrl,

    });

  }

  catch (error) {

    console.error(
      "AUDIO UPLOAD/CONVERSION ERROR:",
      error
    );

    res.status(500).json({

      message:
        "Audio upload failed",

      error:
        error.message,

    });

  }

};


module.exports = {
  uploadAudio,
};
// const { PutObjectCommand,  GetObjectCommand } = require("@aws-sdk/client-s3");
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
// const { v4: uuidv4 } = require("uuid");
// const ffmpegPath = require("ffmpeg-static");
// const { spawn } = require("child_process");

// const s3 = require("../config/s3");

// const convertWebMToMP3 = (inputBuffer) => {
//   return new Promise((resolve, reject) => {
//     const ffmpeg = spawn(ffmpegPath, [
//       "-i",
//       "pipe:0",
//       "-f",
//       "mp3",
//       "-acodec",
//       "libmp3lame",
//       "-ab",
//       "128k",
//       "pipe:1",
//     ]);

//     const chunks = [];
//     const errorChunks = [];

//     ffmpeg.stdout.on("data", (chunk) => {
//       chunks.push(chunk);
//     });

//     ffmpeg.stderr.on("data", (chunk) => {
//       errorChunks.push(chunk);
//     });

//     ffmpeg.on("error", (error) => {
//       reject(error);
//     });

//     ffmpeg.on("close", (code) => {
//       if (code !== 0) {
//         const errorMessage = Buffer.concat(errorChunks).toString();

//         reject(
//           new Error(
//             `FFmpeg conversion failed: ${errorMessage}`
//           )
//         );

//         return;
//       }

//       resolve(Buffer.concat(chunks));
//     });

//     ffmpeg.stdin.write(inputBuffer);
//     ffmpeg.stdin.end();
//   });
// };

// const uploadAudio = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         message: "No audio file uploaded",
//       });
//     }

//     console.log("Original audio:");
//     console.log("Mimetype:", req.file.mimetype);
//     console.log("Size:", req.file.size);

//     // ================================
//     // Convert WebM → MP3
//     // ================================

//     const mp3Buffer = await convertWebMToMP3(
//       req.file.buffer
//     );

//     console.log("MP3 conversion successful");
//     console.log("MP3 size:", mp3Buffer.length);

//     // ================================
//     // Upload MP3 to S3
//     // ================================

//     const fileName =
//       `voice-recordings/${uuidv4()}.mp3`;

//     const command = new PutObjectCommand({
//       Bucket: process.env.AWS_BUCKET_NAME,

//       Key: fileName,

//       Body: mp3Buffer,

//       ContentType: "audio/mpeg",
//     });

//     await s3.send(command);

//     // Generate temporary signed URL for playback
//     const audioUrl = await getSignedUrl(
//       s3,
//       new GetObjectCommand({
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: fileName,
//       }),
//       {
//         expiresIn: 3600, // 1 hour
//       }
//     );

//     console.log("MP3 uploaded to S3:");
//     console.log(audioUrl);

//     res.status(200).json({
//       message: "Audio converted and uploaded successfully",
//       audioUrl,
//     });

//   } catch (error) {
//     console.error(
//       "AUDIO UPLOAD/CONVERSION ERROR:",
//       error
//     );

//     res.status(500).json({
//       message: "Audio upload failed",
//       error: error.message,
//     });
//   }
// };

// module.exports = {
//   uploadAudio,
// };
// // const { PutObjectCommand } = require("@aws-sdk/client-s3");

// // const { v4: uuidv4 } = require("uuid");

// // const s3 = require("../config/s3");

// // const uploadAudio = async (req, res) => {
// //   try {

// //     if (!req.file) {
// //       return res.status(400).json({
// //         message: "No audio file uploaded",
// //       });
// //     }

// //     const fileName = `voice-recordings/${uuidv4()}.webm`;

// //     const command = new PutObjectCommand({

// //       Bucket: process.env.AWS_BUCKET_NAME,

// //       Key: fileName,

// //       Body: req.file.buffer,

// //       ContentType: req.file.mimetype,

// //     });

// //     await s3.send(command);

// //     const audioUrl =
// //       `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

// //     res.status(200).json({
// //       message: "Audio uploaded successfully",
// //       audioUrl,
// //     });

// //   } 
// //   catch (error) {

// //   console.error("UPLOAD ERROR:", error);

// //   res.status(500).json({

// //     message: "Audio upload failed",

// //     error: error.message,

// //   });

// // }
// // };

// // module.exports = {
// //   uploadAudio,
// // };


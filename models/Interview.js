const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      default: "easy",
    },
    questions: [
      {
        question: String,
      },
    ],
    answers: [
      {
        question: String,
        answer: String,
      },
    ],

    interviewType: {
    type: String,
    enum: ["written", "voice"],
    required: true,
},

      voiceAnswers: [
    {
      question: {
        type: String,
      },

      transcript: {
        type: String,
        default: "",
      },

      audioUrl: {
        type: String,
        default: "",
      },

      duration: {
        type: Number,
        default: 0,
      },

      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

    feedback: [
      {
        question: String,
        score: Number,
        comment: String,
        improvement: String,
      },
    ],


    status: {
      type: String,
      enum: ["started", "completed"],
      default: "started",
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);
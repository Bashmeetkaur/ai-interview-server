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
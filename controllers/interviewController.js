const Interview = require("../models/Interview");
// const questionBank = require("../data/questionBank");
const { evaluateAnswer, generateInterviewQuestions } = require("../services/aiService");

// // 🧠 Helper: Generate Feedback
// const generateFeedback = (answers) => {
//   return answers.map((item) => {
//     let score = 0;
//     let comment = "";

//     if (item.answer.length > 50) {
//       score = 8;
//       comment = "Good detailed answer";
//     } else if (item.answer.length > 20) {
//       score = 6;
//       comment = "Average answer, add more details";
//     } else {
//       score = 3;
//       comment = "Too short, needs improvement";
//     }

//     return {
//       question: item.question,
//       score,
//       comment,
//     };
//   });
// };---> befor AI integration

const generateAIFeedback = async (
  answers
) => {
  const feedbackResults = [];

  for (const item of answers) {

    const aiResponse =
      await evaluateAnswer(
        item.question,
        item.answer
      );

    // console.log(aiResponse);

    // safer regex extraction
    const scoreMatch =
      aiResponse.match(
        /Score:\s*(\d+)/i
      );

    const feedbackMatch =
      aiResponse.match(
        /Feedback:\s*([\s\S]*?)Improvement:/i
      );

    const improvementMatch =
      aiResponse.match(
        /Improvement:\s*([\s\S]*)/i
      );

    feedbackResults.push({
      question: item.question,

      score: scoreMatch
        ? Number(scoreMatch[1])
        : 5,

      comment: feedbackMatch
        ? feedbackMatch[1].trim()
        : "No feedback",

      improvement: improvementMatch
        ? improvementMatch[1].trim()
        : "No suggestion",
    });
  }

  return feedbackResults;
};


// 🚀 @route POST /api/interviews/start
    const startInterview = async (req, res) => {
    try {
    const { role, difficulty } =
      req.body;

    // AI GENERATED QUESTIONS
    const generatedQuestions =
      await generateInterviewQuestions(
        role,
        difficulty
      );

    // SAFETY FALLBACK
    const questions =
      generatedQuestions.map((q) => ({
        question: q,
      }));

    // CREATE INTERVIEW
    const interview =
      await Interview.create({
        user: req.user._id,

        role,

        difficulty,

        questions,

        status: "started",
      });

    res.status(201).json(interview);

    } catch (error) {

    res.status(500).json({
      message: error.message,
    });

    }
    };


// 🚀 @route POST /api/interviews/:id/submit
const submitAnswers = async (req, res) => {
  try {
    const { answers } = req.body;

    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    interview.answers = answers;
    interview.feedback = await generateAIFeedback(answers);
    interview.status = "completed";

    const updatedInterview = await interview.save();

    // ✅ CLEAN RESPONSE (important)
    res.json({
      id: updatedInterview._id,
      role: updatedInterview.role,
      difficulty: updatedInterview.difficulty,
      status: updatedInterview.status,
      feedback: updatedInterview.feedback,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🚀 @route GET /api/interviews
const getUserInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🚀 @route GET /api/interviews/:id
const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🚀 @route GET /api/interviews/insights
const getDashboardInsights = async (req, res) => {
  try {
    const interviews = await Interview.find({
      user: req.user._id,
      status: "completed",
    });

    if (interviews.length === 0) {
      return res.json({
        totalInterviews: 0,
        averageScore: 0,
        bestScore: 0,
        message: "No completed interviews yet",
      });
    }

    let totalScore = 0;
    let totalQuestions = 0;
    let bestScore = 0;

    interviews.forEach((interview) => {
      const scores = interview.feedback.map((f) => f.score);

      const interviewScore =
        scores.reduce((a, b) => a + b, 0) / scores.length;

      totalScore += interviewScore;
      totalQuestions += scores.length;

      if (interviewScore > bestScore) {
        bestScore = interviewScore;
      }
    });

    const averageScore = totalScore / interviews.length;

    res.json({
      totalInterviews: interviews.length,
      averageScore: Number(averageScore.toFixed(2)),
      bestScore: Number(bestScore.toFixed(2)),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/interviews/:id/save
const saveInterviewProgress = async (req, res) => {
  try {
    const { answers } = req.body;

    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    // owner check
    if (
      interview.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    // save answers only
    interview.answers = answers;

    // keep status as started
    interview.status = "started";

    const updatedInterview =
      await interview.save();

    res.json({
      message: "Progress saved",
      answers: updatedInterview.answers,
      status: updatedInterview.status,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @route DELETE /api/interviews/:id
const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(
      req.params.id
    );

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    // owner check
    if (
      interview.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    // delete interview properly
    await Interview.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Interview cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ EXPORTS
module.exports = {
  startInterview,
  submitAnswers,
  getUserInterviews,
  getInterviewById,
  getDashboardInsights,
  saveInterviewProgress,
  deleteInterview,
};
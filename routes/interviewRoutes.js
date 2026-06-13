const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  startInterview,
  submitAnswers,
  getUserInterviews,
  getInterviewById,
  getDashboardInsights,
  saveInterviewProgress,
  deleteInterview
} = require("../controllers/interviewController");

router.post("/start", protect, startInterview);
router.post("/:id/submit", protect, submitAnswers);
router.put("/:id/save", protect, saveInterviewProgress);
router.get("/insights", protect, getDashboardInsights);
router.get("/", protect, getUserInterviews);
router.get("/:id", protect, getInterviewById);
router.delete("/:id", protect, deleteInterview);

module.exports = router;
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

// @route GET /api/users/profile
router.get("/profile", protect, (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email
  });
});

module.exports = router;
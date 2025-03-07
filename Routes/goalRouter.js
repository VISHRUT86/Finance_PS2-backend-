const express = require("express");
const router = express.Router();
const User = require("../Models/User");

router.post("/", async (req, res) => {
  const { userId, annualGoal } = req.body;

  if (!userId || !annualGoal) {
    return res
      .status(400)
      .json({ message: "User ID and Annual Goal are required!" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    user.annualGoal = annualGoal;
    await user.save();

    res
      .status(201)
      .json({
        message: "Goal updated successfully!",
        annualGoal: user.annualGoal,
      });
  } catch (error) {
    console.error("Error saving goal:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;

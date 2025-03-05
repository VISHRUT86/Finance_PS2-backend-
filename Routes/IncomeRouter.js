const express = require("express");
const Income = require("../Models/Income");
const ensureAuthenticated = require("../Middlewares/Auth");

const router = express.Router();

router.post("/add", ensureAuthenticated, async (req, res) => {
  try {
    const { amount, date, source, category } = req.body;

    if (!amount || !date || !source || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newIncome = new Income({
      user: req.user.id,
      amount,
      date,
      source,
      category,
    });

    await newIncome.save();
    res
      .status(201)
      .json({ message: "Income added successfully", income: newIncome });
  } catch (error) {
    console.error("Error adding income:", error);
    res.status(500).json({ error: "Error adding income" });
  }
});

router.get("/all", ensureAuthenticated, async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user.id }).sort({ date: -1 });
    res.json(incomes);
  } catch (error) {
    console.error("Error fetching incomes:", error);
    res.status(500).json({ error: "Error fetching incomes" });
  }
});

router.put("/update/:id", ensureAuthenticated, async (req, res) => {
  try {
    const { category, amount, date, source } = req.body;

    const income = await Income.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { amount, date, source },
      { new: true }
    );

    if (!income) {
      return res.status(404).json({ error: "Income not found" });
    }

    res.json({ message: "Income updated successfully", income });
  } catch (error) {
    console.error("Error updating income:", error);
    res.status(500).json({ error: "Error updating income" });
  }
});

router.delete("/delete/:id", ensureAuthenticated, async (req, res) => {
  try {
    const income = await Income.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!income) {
      return res
        .status(404)
        .json({ error: "Income not found or unauthorized" });
    }

    res.json({ message: "Income deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error deleting income" });
  }
});

module.exports = router;

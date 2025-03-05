const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const fastCsv = require("fast-csv");
const Income = require("../Models/Income");
const Expense = require("../Models/Expense");

router.get("/export", async (req, res) => {
  try {
    const incomes = await Income.find({});
    const expenses = await Expense.find({});

    const transactions = [...incomes, ...expenses].map((item) => ({
      Type: item.__t === "Income" ? "Income" : "Expense",
      Amount: item.amount,
      Category: item.category,
      Date: new Date(item.date).toISOString().split("T")[0],
    }));

    const filePath = path.join(__dirname, "../exports/transactions.csv");
    const ws = fs.createWriteStream(filePath);

    // csv
    fastCsv
      .write(transactions, { headers: true })
      .pipe(ws)
      .on("finish", () => {
        res.download(filePath, "transactions.csv", (err) => {
          if (err) console.error("Download Error:", err);
        });
      });
  } catch (error) {
    console.error("CSV Export Error:", error);
    res.status(500).json({ message: "Error generating CSV" });
  }
});

module.exports = router;

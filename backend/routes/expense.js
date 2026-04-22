const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const auth = require("../middleware/auth");

// ADD EXPENSE (Protected)
router.post("/expense", auth, async (req, res) => {
  try {
    const { title, amount, category } = req.body;

    const expense = new Expense({
      user: req.user.id,
      title,
      amount,
      category
    });

    await expense.save();

    res.json({ msg: "Expense added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL EXPENSES (Protected)
router.get("/expenses", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
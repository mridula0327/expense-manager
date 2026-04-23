const express = require("express");
const router = express.Router();
const Item = require("../models/Expense"); // file name same, model Item hai
const auth = require("../middleware/auth");

// ➕ ADD ITEM (Lost / Found)
router.post("/item", auth, async (req, res) => {
  try {
    const item = new Item({
      ...req.body,
      user: req.user.id
    });

    await item.save();
    res.json({ msg: "Item added successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📥 GET ALL ITEMS
router.get("/items", auth, async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id });
    res.json(items);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
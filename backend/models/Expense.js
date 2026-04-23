const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  itemName: String,
  description: String,
  type: String, // Lost / Found
  location: String,
  date: String,
  contactInfo: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Item", itemSchema);
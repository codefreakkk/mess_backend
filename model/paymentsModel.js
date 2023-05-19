const mongoose = require("mongoose");

const payment = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  mess_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "messModel",
  },
  date: {
    type: String,
  },
  tiffin_type: {
    type: String,
  },
  tiffin_count: {
    type: String,
  },
});

module.exports = new mongoose.model("paymentsMode", payment);

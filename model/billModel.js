const mongoose = require("mongoose");

const bill = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    mess_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "messModel",
    },
    u_email: {
      type: String,
      default: "",
    },
    tiffins: {
      type: String,
      default: "0",
    },
    tiffin_type: {
      type: String,
      default: "0",
    },
    total_amount: {
      type: String,
      default: "0",
    },
    date: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("billModel", bill);

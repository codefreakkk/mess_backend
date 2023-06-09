const mongoose = require("mongoose");

const user = mongoose.Schema(
  {
    u_name: {
      type: String,
      default: "Enter your name",
    },
    mess_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "messModel",
    },
    u_email: {
      type: String,
      required: [true, "Please add your email"],
      unique: [true, "User already exists"],
      // ref: "userDetails"
    },
    u_password: {
      type: String,
      required: [true, "Please add your password"],
    },
    u_image: {
      type: String,
      default: "NOFILE",
    },
    u_contact: {
      type: String,
      maxLength: [15, "Contact number cannot be larger than 15 digits"],
      default: "",
    },
    tiffin_type: {
      type: String,
      default: "0",
    },
    tiffin_count: {
      type: String,
      default: "0",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", user);

const mongoose = require("mongoose");

const mess = mongoose.Schema(
  {
    mess_name: {
      type: String,
      default: "",
      required: [true, "Please add your name"],
    },
    mess_email : {
      type: String,
    },
    mess_contact: {
      type: String,
      default: "",
    },
    mess_password: {
      type: String,
      required: [true, "Please add your password"],
    },
    mess_address: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("messModel", mess);

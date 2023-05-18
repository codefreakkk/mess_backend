const billModel = require("../model/billModel");
const messModel = require("../model/messModel");
const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");

exports.addMess = async (req, res) => {
  try {
    const { mess_name, mess_email, mess_contact, mess_password, mess_address } =
      req.body;

    // if already registered
    const data = await messModel.findOne({ mess_email });
    if (data) {
      return res.status(200).json({
        success: false,
        message: "Mess with this email is already registered",
      });
    }

    const result = await messModel.create({
      mess_name,
      mess_email,
      mess_contact,
      mess_password,
      mess_address,
    });
    if (result) {
      return res
        .status(200)
        .json({ success: true, message: "Registered successfully" });
    } else {
      return res
        .status(400)
        .json({ sucess: false, message: "Regitration not successfully" });
    }
  } catch (e) {
    return res.status(500).json({ message: "Some error occured" });
  }
};

exports.addBill = async (req, res) => {
  try {
    const { user_id, tiffins, tiffin_type, total_amount } = req.body;
    const mess_id = req.mess._id.toString();
    console.log(tiffins);

    // validate if user has sufficient tiffin's in his/her account
    const data = await userModel.findOne({ _id: user_id });
    let tiffin_count = parseInt(data.tiffin_count);

    if (parseInt(tiffins) == 0 || tiffin_count == 0 || tiffin_count - parseInt(tiffins) < 0) {
      return res.status(200).json({
        success: false,
        message: "Cannot buy meal please add more tiffins",
      });
    }

    // update user tiffin's
    await userModel.findOneAndUpdate(
      { _id: user_id },
      {
        $set: {
          tiffin_count: tiffin_count - parseInt(tiffins),
        },
      }
    );

    // find todays date
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}-${month}-${year}`;

    // store data into db
    const result = await billModel.create({
      user_id,
      mess_id,
      tiffins,
      tiffin_type,
      total_amount,
      date: currentDate,
    });

    if (result) {
      return res
        .status(200)
        .json({ success: true, message: "Bill created succsssfully" });
    } else {
      return res
        .status(400)
        .json({ sucess: false, message: "Bill not created" });
    }
  } catch (e) {
    return res.status(500).json({ message: "Some error occured" });
  }
};

exports.messLogin = async (req, res) => {
  try {
    const { mess_email, mess_password } = req.body;
    const user = await messModel.findOne({ mess_email, mess_password });
    if (user) {
      const uid = user._id.toString();

      // generate JWT token
      const token = jwt.sign({ uid }, "messsecret", { expiresIn: "1d" });
      return res
        .status(200)
        .json({ success: true, token: `Bearer ${token}`, mess_email });
    } else
      return res.status(200).json({
        success: false,
        message: `Please check your username or password`,
      });
  } catch (e) {
    return res.status(500).json({ err: e.message });
  }
};

exports.getAllBillsById = async (req, res) => {
  try {
    const mess_id = req.mess._id.toString();
    const result = await billModel
      .find({ mess_id })
      .populate("user_id")
      .sort({ _id: -1 });

    if (result) {
      return res.status(200).json({ success: true, data: result });
    } else {
      return res.status(200).json({ success: false, data: null });
    }
  } catch (e) {
    return res.status(500).json({ err: e.message });
  }
};

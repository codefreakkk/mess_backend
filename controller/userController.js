const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const billModel = require("../model/billModel");
const paymentsModel = require("../model/paymentsModel");

// image upload configuration
cloudinary.config({
  cloud_name: "duwbwdwqc",
  api_key: "723896973772636",
  api_secret: "srE4voWKjc8uQ8MnR4BXXqDecgY",
});

exports.login = async (req, res) => {
  try {
    const { u_email, u_password } = req.body;
    const user = await userModel.findOne({ u_email, u_password });
    if (user) {
      const uid = user._id.toString();

      // generate JWT token
      const token = jwt.sign({ uid }, "devsinfo", { expiresIn: "1d" });
      return res
        .status(200)
        .json({ success: true, token: `Bearer ${token}`, u_email, uid });
    } else
      return res.status(200).json({
        success: false,
        message: `Please check your username or password`,
      });
  } catch (e) {
    return res.status(400).json({ err: e.message });
  }
};

exports.signup = async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({ status: false, message: "File not found" });
    }

    const profile = req.files.profile;
    const path = profile.tempFilePath;

    const {
      u_name,
      u_email,
      u_password,
      u_contact,
    } = req.body;
    const mess_id = req.mess._id.toString();
    const user = await userModel.findOne({ u_email });

    if (user) {
      return res.status(200).json({
        success: false,
        message: `User with this email already exists`,
      });
    }

    cloudinary.uploader.upload(path, async (err, result) => {
      if (err) {
        return res
          .status(200)
          .json({ message: "Some error occured while uploading file" });
      }

      const url = result.url;

      const data = await userModel.create({
        u_name: u_name,
        mess_id: mess_id,
        u_email: u_email,
        u_password: u_password,
        u_image: url,
        u_contact: u_contact,
      });

      if (data) {
        return res
          .status(200)
          .json({ success: true, message: "User added successfully" });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Some error occured" });
      }
    });
  } catch (e) {
    console.log("some error occured");
    return res.status(400).json({ err: e.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const mess_id = req.mess._id.toString();
    const users = await userModel.find({ mess_id });
    if (users) {
      return res.status(200).json({ status: true, data: users });
    } else {
      return res.status(400).json({ status: false, data: null });
    }
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: "Some error occured" });
  }
};

exports.getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const mess_id = req.mess._id.toString();
    const result = await userModel.findOne({
      u_email: email,
      mess_id: mess_id,
    });

    if (result) {
      return res.status(200).json({ success: true, data: result });
    } else {
      return res.status(200).json({ success: false, data: null });
    }
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: "Some error occured" });
  }
};

exports.getUserByEmailAndMessId = async (req, res) => {
  try {
    const u_email = req.params.email;
    const mess_id = req.params.messid;

    const result = await userModel.findOne({ u_email, mess_id });
    if (result) {
      return res.status(200).json({ success: true, data: result });
    } else {
      return res.status(200).json({ success: false, data: null });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

exports.addBillByUser = async (req, res) => {
  try {
    const { count, tiffins, tiffin_type, mess_id, uid } = req.body;
    const u_email = req.user.u_email;

    const parsed_count = parseInt(count);
    const parsed_tiffins = parseInt(tiffins);
    console.log(parsed_tiffins);
    const parsed_tiffin_type = parseInt(tiffin_type);

    if (parsed_count == 0) {
      return res
        .status(200)
        .json({ success: false, message: "Enter tiffin greater than 0" });
    }

    if (parsed_tiffins - parsed_count < 0) {
      return res.status(200).json({
        success: false,
        message: "You don't have enough tiffins left",
      });
    }

    // update user account if enough tiffins are left
    // update user tiffin's
    await userModel.findOneAndUpdate(
      { _id: uid },
      {
        $set: {
          tiffin_count: parsed_tiffins - parsed_count,
        },
      }
    );

    // find todays date
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}-${month}-${year}`;

    // total tiffin's bought
    const total = parsed_count * parsed_tiffin_type;

    // store data into db
    const result = await billModel.create({
      user_id: uid,
      mess_id: mess_id,
      u_email: u_email,
      tiffins: count,
      tiffin_type: tiffin_type,
      total_amount: total,
      date: currentDate,
    });

    if (result) {
      return res
        .status(200)
        .json({ success: true, message: "Bill created successsfully" });
    } else {
      return res
        .status(200)
        .json({ sucess: false, message: "Bill not created" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const uid = req.params.uid;
    const result = await userModel.findOne({ _id: uid });

    if (result) {
      return res.status(200).json({ success: true, data: result });
    } else {
      return res.status(200).json({ success: false, data: null });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e.message });
  }
};

exports.updateuserbyuser = async (req, res) => {
  try {
    const uid = req.params.uid;
    const { u_name, u_contact, u_password } = req.body;

    const result = await userModel.findOneAndUpdate(
      { _id: uid },
      {
        $set: {
          u_name,
          u_password,
          u_contact,
        },
      }
    );

    if (result) {
      return res.status(200).json({ success: true, message: "User updated" });
    } else {
      return res
        .status(200)
        .json({ success: false, message: "User not updated" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e.message });
  }
};

exports.getUserByIdForMess = async (req, res) => {
  try {
    const uid = req.params.uid;
    const result = await userModel.findOne({
      _id: uid,
    });

    if (result) {
      return res.status(200).json({ success: true, data: result });
    } else {
      return res.status(200).json({ success: false, data: null });
    }
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: "Some error occured" });
  }
};


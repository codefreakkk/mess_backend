const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

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
        .json({ success: true, token: `Bearer ${token}`, u_email });
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

    const { u_name, u_email, u_password, u_contact, tiffin_type, tiffin_count } = req.body;
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
        tiffin_type: tiffin_type,
        tiffin_count: tiffin_count
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
    const users = await userModel.find({mess_id});
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
    const result = await userModel.findOne({ u_email: email, mess_id: mess_id });

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

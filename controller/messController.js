const billModel = require("../model/billModel");
const messModel = require("../model/messModel");
const paymentsModel = require("../model/paymentsModel");
const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const prefferedMeal = require("../model/prefferedMeal");

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

exports.updateMess = async (req, res) => {
  try {
    const mess_id = req.mess._id.toString();
    const { mess_name, mess_contact, mess_password, mess_address, meal } =
      req.body;

    const result = await messModel.findOneAndUpdate(
      { _id: mess_id },
      {
        $set: {
          mess_name,
          mess_contact,
          mess_password,
          mess_address,
          meal,
        },
      }
    );

    if (result) {
      return res
        .status(200)
        .json({ success: true, message: "Updated successfully" });
    } else {
      return res.status(200).json({ sucess: false, message: "Not updated" });
    }
  } catch (e) {
    return res.status(500).json({ message: "Some error occured" });
  }
};

exports.addBill = async (req, res) => {
  try {
    const { user_id, tiffins, tiffin_type, total_amount, u_email } = req.body;
    const mess_id = req.mess._id.toString();

    // validate if user has sufficient tiffin's in his/her account
    const data = await userModel.findOne({ _id: user_id });
    let tiffin_count = parseInt(data.tiffin_count);

    if (
      parseInt(tiffins) == 0 ||
      tiffin_count == 0 ||
      tiffin_count - parseInt(tiffins) < 0
    ) {
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
      u_email,
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
        .status(200)
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
      return res.status(200).json({
        success: true,
        token: `Bearer ${token}`,
        mess_email,
        mess_id: uid,
      });
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

exports.getBillByUserId = async (req, res) => {
  try {
    const uid = req.params.uid;
    const result = await billModel.find({ user_id: uid }).sort({ _id: -1 });
    if (result) {
      return res.status(200).json({ success: true, data: result });
    } else {
      return res.status(200).json({ success: false, data: null });
    }
  } catch (e) {
    return res.status(500).json({ err: e.message });
  }
};

exports.edituserbymess = async (req, res) => {
  try {
    const uid = req.params.uid;
    const mess_id = req.mess._id.toString();
    const { u_name, u_password, u_contact, tiffin_type, tiffin_count } =
      req.body;

    const result = await userModel.findOneAndUpdate(
      { _id: uid },
      {
        $set: {
          u_name,
          u_password,
          u_contact,
          tiffin_type,
          tiffin_count,
        },
      }
    );

    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}-${month}-${year}`;

    // store data into payments db
    await paymentsModel.create({
      user_id: uid,
      mess_id: mess_id,
      date: currentDate,
      tiffin_type,
      tiffin_count,
    });

    if (result) {
      return res
        .status(200)
        .json({ success: true, message: "Data updated successfully" });
    } else {
      return res.status(200).json({ success: false, data: "Data not updated" });
    }
  } catch (e) {
    return res.status(500).json({ err: e.message });
  }
};

exports.getpaymentsbyuseridformess = async (req, res) => {
  try {
    const uid = req.params.uid;

    const result = await paymentsModel
      .find({ user_id: uid })
      .populate("user_id");
    if (result) {
      return res.status(200).json({ success: true, data: result });
    } else {
      return res.status(200).json({ success: false, data: null });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

exports.getpaymentsbyuseridforuser = async (req, res) => {
  try {
    const uid = req.params.uid;

    const result = await paymentsModel
      .find({ user_id: uid })
      .populate("user_id");
    if (result) {
      return res.status(200).json({ success: true, data: result });
    } else {
      return res.status(200).json({ success: false, data: null });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

exports.getMess = async (req, res) => {
  try {
    const mess_id = req.mess._id.toString();
    const result = await messModel.findOne({ _id: mess_id });

    if (result) {
      return res.status(200).json({ success: true, data: result });
    } else {
      return res.status(200).json({ success: false, data: null });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

exports.billsearch = async (req, res) => {
  try {
    const mess_id = req.mess._id.toString();
    const filter = req.params.filter;
    console.log(filter);
    const result = await billModel
      .find({ mess_id })
      .populate("user_id")
      .find({ u_email: filter });

    if (result) {
      return res.status(200).json({ success: true, data: result });
    } else {
      return res.status(200).json({ success: false, data: null });
    }
  } catch (e) {
    return res.status(500).json({ err: e.message });
  }
};

exports.gettotalrevenue = async (req, res) => {
  try {
    const mess_id = req.mess._id.toString();
    const result = await billModel.find({ mess_id });

    // find total revenue
    let total = 0;
    result.map((result, index) => {
      return (total += parseInt(result.total_amount));
    });

    // find total tiffins sold
    let tiffins = 0;
    result.map((result) => {
      return (tiffins += parseInt(result.tiffins));
    });

    if (result) {
      res.status(200).json({ success: true, tiffins, total });
    } else {
      res.status(200).json({ success: false, tiffins: 0, total: 0 });
    }
  } catch (e) {
    return res.status(500).json({ err: e.message });
  }
};

exports.addprefferedmeal = async (req, res) => {
  try {
    
    const {meal_name} = req.body;
    const mess_id = req.user.mess_id.toString()

    const result = await prefferedMeal.create({mess_id, meal_name});
    if (result) {
      res.status(200).json({ success: true, message:"Response has been sent" });
    } else {
      res.status(200).json({ success: false, message: "Response has not been sent"});
    }
  }
  catch (e) {
    return res.status(500).json({ err: e.message });
  }
}

exports.getprefferedmeal = async (req, res) => {
  try {
    
    const mess_id = req.params.mid;
    const result = await prefferedMeal.find({mess_id}).sort({_id: -1});
    if (result) {
      res.status(200).json({ success: true, data: result });
    } else {
      res.status(200).json({ success: false, data: null});
    }
  }
  catch (e) {
    console.log(e);
    return res.status(500).json({ err: e.message });
  }
}
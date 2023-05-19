const express = require("express");
const router = express.Router();
const messAuth = require("../middleware/messAuth");
const auth = require("../middleware/auth");

const messController = require("../controller/messController");


// get requests
router.get("/getallbillsbyid", messAuth, messController.getAllBillsById);
router.get("/getbillbyuserid/:uid", auth, messController.getBillByUserId);
router.get("/getpaymentsbyuseridformess/:uid", messAuth, messController.getpaymentsbyuseridformess);
router.get("/getpaymentsbyuseridforuser/:uid", auth, messController.getpaymentsbyuseridforuser);
router.get("/getmess", messAuth, messController.getMess);
router.get("/billsearch/:filter", messAuth, messController.billsearch);
router.get("/gettotalrevenue", messAuth, messController.gettotalrevenue);
router.get("/getprefferedmeal/:mid", messAuth, messController.getprefferedmeal)

// post requests
router.post("/addmess", messController.addMess);
router.post("/updatemess", messAuth, messController.updateMess);
router.post("/addbill", messAuth, messAuth, messController.addBill);
router.post("/messlogin", messController.messLogin);
router.post("/edituserbymess/:uid", messAuth, messController.edituserbymess);
router.post("/addprefferedmeal", auth, messController.addprefferedmeal)


module.exports = router;

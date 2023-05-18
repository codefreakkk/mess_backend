const express = require("express");
const router = express.Router();
const messAuth = require("../middleware/messAuth");

const messController = require("../controller/messController");

router.get("/getallbillsbyid", messAuth, messController.getAllBillsById);
router.post("/addmess", messController.addMess);
router.post("/addbill", messAuth, messAuth, messController.addBill);
router.post("/messlogin", messController.messLogin);

module.exports = router;

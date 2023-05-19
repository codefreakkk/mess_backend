const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const messAuth = require("../middleware/messAuth");
const auth = require("../middleware/auth");

router.use(
  fileUpload({
    useTempFiles: true,
  })
);

const userController = require("../controller/userController");

router.get("/getuserbyemail/:email", messAuth, userController.getUserByEmail);
router.get("/getuserbyid/:uid", auth, userController.getUserById);
router.get("/getuserbyidformess/:uid", messAuth, userController.getUserByIdForMess);
router.get("/getuserbyemailandmessid/:email/:messid", auth, userController.getUserByEmailAndMessId);
router.get("/getallusers", messAuth, userController.getAllUsers);


router.post("/login", userController.login);
router.post("/signup", messAuth, userController.signup);
router.post("/addbillbyuser", auth, userController.addBillByUser);
router.post("/updateuserbyuser/:uid", auth, userController.updateuserbyuser);



module.exports = router;

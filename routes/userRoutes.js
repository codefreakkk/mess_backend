const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const messAuth = require("../middleware/messAuth");

router.use(
  fileUpload({
    useTempFiles: true,
  })
);

const userController = require("../controller/userController");

router.get("/getuserbyemail/:email", messAuth, userController.getUserByEmail);
router.get("/getallusers", messAuth, userController.getAllUsers)
router.post("/login", userController.login);
router.post("/signup", messAuth, userController.signup);

module.exports = router;

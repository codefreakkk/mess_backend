const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");

router.use(
  fileUpload({
    useTempFiles: true,
  })
);

const userController = require("../controller/userController");

router.post("/login", userController.login);
router.post("/signup", userController.signup);
router.get("/getallusers", userController.getAllUsers)

module.exports = router;

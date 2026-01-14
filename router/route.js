const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
router.post("/api/register", userController.userRegister);
router.post("/api/login", userController.userLogin);
router.post('/api/googlelogin',userController.googleUserLogin)
module.exports = router;

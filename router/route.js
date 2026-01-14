const express = require("express");

const userController = require("../controllers/userController");
const bugController=require('../controllers/bugController')

const router = express.Router();
router.post("/api/register", userController.userRegister);
router.post("/api/login", userController.userLogin);
router.post('/api/googlelogin',userController.googleUserLogin)

router.post('/api/addbug',bugController.addBug)
module.exports = router;

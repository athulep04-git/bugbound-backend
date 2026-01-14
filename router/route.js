const express = require("express");

const userController = require("../controllers/userController");
const bugController=require('../controllers/bugController');
const jwtMiddleware = require("../middleware/jwtMiddleware");
const router = express.Router();
router.post("/api/register", userController.userRegister);
router.post("/api/login", userController.userLogin);
router.post('/api/googlelogin',userController.googleUserLogin)

//add bug
router.post('/api/addbug',jwtMiddleware,bugController.addBug)
module.exports = router;

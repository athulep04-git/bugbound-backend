const express = require("express");

const userController = require("../controllers/userController");
const bugController=require('../controllers/bugController');
const bountyController = require("../controllers/bountyController");

const jwtMiddleware = require("../middleware/jwtMiddleware");
const multerConfig=require('../middleware/multerMiddleware')
const router = express.Router();
router.post("/api/register", userController.userRegister);
router.post("/api/login", userController.userLogin);
router.post('/api/googlelogin',userController.googleUserLogin)

//add bug
router.post('/api/addbug',jwtMiddleware,multerConfig.array('UploadedImages',3),bugController.addBug)
router.get('/api/getbugs', jwtMiddleware,bugController.getBugs);
router.get("/api/getbug/:id", jwtMiddleware, bugController.getBugDetails);


//add bounty
router.post("/api/addbounty",jwtMiddleware,multerConfig.array("UploadedImages", 3),bountyController.addBounty);
router.get("/api/getbounties", jwtMiddleware, bountyController.getBounties);


module.exports = router;

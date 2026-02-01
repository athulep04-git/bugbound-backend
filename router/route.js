const express = require("express");
//controllers
const userController = require("../controllers/userController");
const bugController=require('../controllers/bugController');
const bountyController = require("../controllers/bountyController");

const jwtMiddleware = require("../middleware/jwtMiddleware");
const multerConfig=require('../middleware/multerMiddleware')
const router = express.Router();

//user
router.post("/api/register", userController.userRegister);
router.post("/api/login", userController.userLogin);
router.post('/api/googlelogin',userController.googleUserLogin)
router.get("/api/leaderboard", userController.getLeaderboard);

//bug
router.post('/api/addbug',jwtMiddleware,multerConfig.array('UploadedImages',3),bugController.addBug)
router.get('/api/getbugs', jwtMiddleware,bugController.getBugs);
router.get("/api/getbug/:id", jwtMiddleware, bugController.getBugDetails);
router.get("/api/mybugs", jwtMiddleware, bugController.getMyBugs);
router.put("/api/editbug/:id", jwtMiddleware, bugController.editBug);
router.delete("/api/deletebug/:id", jwtMiddleware, bugController.deleteBug);
//bounty
router.post("/api/addbounty",jwtMiddleware,multerConfig.array("UploadedImages",3),bountyController.addBounty);
router.get("/api/getbounties", jwtMiddleware, bountyController.getBounties);
router.get("/api/getbounty/:id", jwtMiddleware, bountyController.getSingleBounty);
router.get("/api/mybounties", jwtMiddleware, bountyController.getMyBounties);
router.put("/api/editbounty/:id", jwtMiddleware, bountyController.editBounty);
module.exports = router;

//profile
router.get("/api/profile", jwtMiddleware, userController.getUserProfile);
router.put("/api/profile",jwtMiddleware,multerConfig.single("profile"),userController.updateProfile);
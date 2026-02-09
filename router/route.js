const express = require("express");
//controllers
const userController = require("../controllers/userController");
const bugController=require('../controllers/bugController');
const bountyController = require("../controllers/bountyController");
const proposalController=require('../controllers/proposalController')
const fixWorkspaceController=require('../controllers/fixworkspaceController')
const adminController=require('../controllers/adminController')
const jwtMiddleware = require("../middleware/jwtMiddleware");
const multerConfig=require('../middleware/multerMiddleware')
const router = express.Router();

//user
router.post("/api/register", userController.userRegister);
router.post("/api/login", userController.userLogin);
router.post('/api/googlelogin',userController.googleUserLogin)
router.get("/api/leaderboard", userController.getLeaderboard);
router.post("/api/rate-debugger", jwtMiddleware, userController.rateDebugger);

//bug
router.post('/api/addbug',jwtMiddleware,multerConfig.array('UploadedImages',3),bugController.addBug)
router.get('/api/getbugs', jwtMiddleware,bugController.getBugs);
router.get("/api/getbug/:id", jwtMiddleware, bugController.getBugDetails);
router.get("/api/mybugs", jwtMiddleware, bugController.getMyBugs);
router.put("/api/editbug/:id", jwtMiddleware, bugController.editBug);
router.delete("/api/deletebug/:id", jwtMiddleware, bugController.deleteBug);

//fixworkspace

router.get("/api/fixworkspace/:bugId",jwtMiddleware,fixWorkspaceController.getWorkspace);
router.put("/api/mark-fixed/:bugId",jwtMiddleware,fixWorkspaceController.markAsFixed);
router.put("/api/approve-fix/:bugId",jwtMiddleware,fixWorkspaceController.approveBug
);


//bounty
router.post("/api/addbounty",jwtMiddleware,multerConfig.array("UploadedImages",3),bountyController.addBounty);
router.get("/api/getbounties", jwtMiddleware, bountyController.getBounties);
router.get("/api/getbounty/:id", jwtMiddleware, bountyController.getSingleBounty);
router.get("/api/mybounties", jwtMiddleware, bountyController.getMyBounties);
router.put("/api/editbounty/:id", jwtMiddleware, bountyController.editBounty);
module.exports = router;
router.delete("/api/deletebounty/:id",jwtMiddleware,bountyController.deleteBounty
);

//profile
router.get("/api/profile", jwtMiddleware, userController.getUserProfile);
router.put("/api/profile",jwtMiddleware,multerConfig.single("profile"),userController.updateProfile);

//proposal
router.post("/api/sendproposal", jwtMiddleware, proposalController.sendProposal);
router.get("/api/bugproposals/:bugId",jwtMiddleware,proposalController.getBugProposals);
router.put("/api/acceptproposal/:proposalId",jwtMiddleware,proposalController.acceptProposal);
router.get("/api/mytasks",jwtMiddleware,proposalController.getMyTasks);


//admin
router.get("/api/admin/stats",jwtMiddleware,adminController.getDashboardStats);
router.get("/api/admin/users",jwtMiddleware,adminController.getAllUsers);
router.put("/api/admin/block/:id",jwtMiddleware,adminController.blockUser);
router.put("/api/admin/unblock/:id",jwtMiddleware,adminController.unblockUser);

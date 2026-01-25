const bounties = require("../models/bountyModel");

exports.addBounty = async (req, res) => {
  console.log("Inside add bounty");
  console.log(req.body);
  const { title, description, category, projectUrl, reward, rules } = req.body;
  const UploadedImages = [];
  req.files.map((item) => UploadedImages.push(item.filename));
  const userMail = req.payload;
  try {
    const existingBounty = await bounties.findOne({ title, userMail });
    if (existingBounty) {
      return res.status(402).json("Bounty already exist");
    }
    const newBounty = new bounties({title,description,category,projectUrl,reward,rules,UploadedImages,userMail,});
    await newBounty.save();
    res.status(200).json({message:"Add bounty success",newBounty});
  } catch (error) {
    res.status(500).json(error);
  }
};


exports.getBounties =async(req,res)=>{
  try {
    const allBounties = await bounties.find();
    res.status(200).json(allBounties);
  } catch (error) {
    res.status(500).json(error);
  }
};

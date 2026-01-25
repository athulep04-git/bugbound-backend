const bounty = require("../models/bountyModel");

exports.addBounty = async (req, res) => {
  console.log("Inside add bounty");
  console.log(req.body);

  const { title, description, category, reward, difficulty } = req.body;

  const UploadedImages = [];
  req.files.map((item) => UploadedImages.push(item.filename));

  const userMail = req.payload;

  try {
    const existingBounty = await bounties.findOne({ title, userMail });
    if (existingBounty) {
      res.status(402).json("Bounty already exist");
    } else {
      const newBounty = new bounty({
        title,
        description,
        category,
        reward,
        difficulty,
        UploadedImages,
        userMail,
      });

      await newBounty.save();
      res.status(200).json("Add bounty success");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

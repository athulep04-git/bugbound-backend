const bugs=require('../models/bugModel')

//add a bug
exports.addBug=async(req,res)=>{
    console.log("Inside add bug");
    console.log(req.body);
    const {title,description,priority,category,fixBudget}=req.body
    console.log(req.files);
    const UploadedImages=[]
    req.files.map(item=>UploadedImages.push(item.filename))
    console.log(UploadedImages);

    //get user mail from JWT verification
    const userMail=req.payload
    console.log(userMail);

    try{
        const existingBug=await bugs.findOne({title,userMail})
        if(existingBug){
            res.status(402).json("Bug already exist")
        }
        else{
            const newBug=new bugs({title,description,priority,category,fixBudget,UploadedImages,userMail})
            await newBug.save()
            res.status(200).json("Add bug success")
        }
    }
    catch(error)
    {
    res.status(500).json(error);
    }
    // res.send("Request recieved")
}

//get all bugs

exports.getBugs = async(req, res) => {
  try {
    const allBugs = await bugs.find().sort({ _id:-1});
    res.status(200).json(allBugs);
  } catch (error) {
    res.status(500).json(error);
  }
};
const bugModel=require('../models/bugModel')

exports.addBug=async(req,res)=>{
    console.log("Inside add bug");
    console.log(req.body);
    
    res.send("Request recieved...")
    
}
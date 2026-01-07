const User =require('../models/userModel')
const jwt =require('jsonwebtoken')
//Logic for register

exports.userRegister=async(req,res)=>{
    const {username,email,password}=req.body;
    try{
        const existingUser=await User.findOne({email})
        if(existingUser){
            res.status(400).json("User already exist")
        }
        else{
            const newUser= new User({username,email,password})
            await newUser.save()
            res.status(200).json({message:"Register success",newUser})

        }
    }
    catch (error) {
     res.status(500).json(error);
}
}

// Login

exports.userLogin=async(req,res)=>{
    const{email,password}=req.body
    try{
        const activeUser=await User.findOne({email})
        if(activeUser){
        if(activeUser.password==password){
            // token generation
            const token =jwt.sign({userMail:activeUser.email,role:activeUser.role},process.env.jwtkey)
            console.log(token);
            
             res.status(200).json({message:"login success",activeUser,token});
        }
        else{
            res.status(401).json("password mismatch")
        }
    }
    else{
        res.status(401).json("user not found")

    }
    }
    catch (error) {
     res.status(500).json({ error: " error" });
}
}


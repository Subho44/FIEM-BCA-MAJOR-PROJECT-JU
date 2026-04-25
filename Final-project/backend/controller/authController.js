const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    },
});

//REGISTER

exports.registeruser = async(req,res)=>{
    try {
        const {name,email,password,role} = req.body;
        const olduser = await User.findOne({email});
        const hspwd = await bcrypt.hash(password,15);
        const otp = Math.floor(100000 + Math.random()*900000).toString();
        

        if(olduser && !olduser.isVerified) {
            olduser.name = name;
            olduser.password = hspwd;
            olduser.role = role;
            olduser.otp = otp;
            olduser.otpExpire = new Date(Date.now() + 5*60*1000);
            await olduser.save();
        } else {
            await User.create({
                name,
                email,
                password:hspwd,
                role,
                otp,
                otpExpire: new Date(Date.now() + 5*60*1000),
            });
        }

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject:"OTP VERIFICATION FOR EDU",
            text:`YOUR OTP IS ${otp}`
        });
        res.status(200).json({message:"otp sent successfully"});

    }catch(err) {
        console.error(err);
    }
}

//verify otp

exports.verifyotp = async(req,res)=>{
    try {
        const {email,otp} = req.body;
        const user = await User.findOne({email});

        if(user.otp !== otp) {
            return res.status(400).json({message:"invalid otp"});
        }
        user.isSelected=true;
        user.otp = null;
        user.otpExpire = null;
        await user.save();
        res.status(200).json({message:"otp verify successfully"});
        
        } catch(err) {
        console.error(err);
    }
}

//login

exports.loginuser = async(req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});
        const ismatch = await bcrypt.compare(password,user.password);

        if(!ismatch) {
            return res.status(400).json({message:"invalid password"});
        }
        
        const token = jwt.sign(
            {
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
           },
         process.env.JWT_SECRET,
         {expiresIn:"5d"}    
        );
        res.status(200).json({message:"login successfully", token});

    }catch(err) {
        console.error(err);
    }
}
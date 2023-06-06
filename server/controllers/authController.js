const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');


async function register(req,res) {
    const { username,email,password, profile} = req.body;
    if(!username || !email || !password){
        return res.status(400).json({success:false,message:"Please fill all fields"});
    }
    const oldUsers = await User.find({$or : [{email},{username}]});
    if(oldUsers.length > 0)
        return res.status(400).json({success:false,message:"User already exists"});
    const hashedPassword = await bcrypt.hash(password,12);
    const user = await User({username,email,password:hashedPassword,profile});
    const refreshToken = await jwt.sign({id:user._id},process.env.REFRESH_TOKEN_SECRET,{expiresIn:"1d"});
    user.token = refreshToken;
    await user.save();   
    res.cookie('token',refreshToken,{httpOnly:true,maxAge:1000*60*60*24,secure:true,sameSite:"none"})
    res.status(200).json({success:true,username:user.username,email:user.email,picture:user.picture,token:refreshToken,userId:user._id}); 
}


async function login(req,res){

    const {email,password} = req.body;
    if(!email || !password) return res.status(401).json({message:"Invalid credentials"})
    const user = await User.findOne({email});
    if(!user)
        return res.status(401).json({success:"false",message:"User does not exists"});
    if(!bcrypt.compareSync(password,user.password))
        return res.status(403).json({success:"false",message:"Wrong password"});
    const token = await jwt.sign({id:user._id},process.env.REFRESH_TOKEN_SECRET,{expiresIn: '1d'})
    user.token = token;
    await user.save();
    
    res.cookie("token",token,{httpOnly:true,maxAge:1000*60*60*24,secure:true,sameSite:"none"})
    return res.status(200).json({success:"true",message:"User Logged In",token,userId:user._id,username:user.username,email:user.email,picture:user.picture})
}


module.exports = {
    register,
    login
}
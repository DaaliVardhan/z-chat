const router = require('express').Router();
const asynchandler = require('express-async-handler');
const { verifyToken } = require('../middleware/verifyToken');
const User = require('../models/userModel');


router.get('/',asynchandler(async (req,res)=>{
    const id = req.query.id;
    const username = req.query.username;
    const email = req.query.email;
    if(!id && !username && !email){
        const users = await User.find({}).select({password:0,token:0}).sort({createdAt:-1});

        res.status(200).json({users});
    }
    else if(id){
        const user = await User.findById(id).select({password:0,token:0});
        return res.status(200).json({user});
    }
    else if(username){
        const user = await User.findOne({username}).select({password:0,token:0});
        return res.status(200).json({user});
    }
    else if(email){
        const user = await User.findOne({email}).select({password:0,token:0});
        return res.status(200).json({user});
    }
    else{
        return res.status(200).json({users:[]});
    }
}))




module.exports = router;
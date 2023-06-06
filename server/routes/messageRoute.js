const router = require('express').Router();
const Message = require('../models/messageModel');
const asyncHandler = require('express-async-handler');

router.post('/',asyncHandler(async(req,res)=>{
    const { conversationId,sender,receiver,text } = req.body;
    if(!conversationId || !sender || !receiver || !text) return res.status(400).json({success:false,message:'All fields are required'});
    const newMessage = await Message.create({conversationId,sender,receiver,text});
    return res.status(200).json(newMessage);
}));


router.get('/:conversationId',asyncHandler(async(req,res)=>{
    const messages = await Message.find({conversationId:req.params.conversationId});
    return res.status(200).json(messages);
}));

module.exports = router;
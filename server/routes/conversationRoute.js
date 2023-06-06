const router = require('express').Router();
const Conversation = require('../models/conversationModel');
const asyncHandler = require('express-async-handler');


router.post('/test',asyncHandler(async(req,res)=>{
    if(!req.body.sender || !req.body.receiver)
        return res.status(400).json({message:"sender and receiver required"})
    const oldConversation = await Conversation.find({members:{$all:[req.body.sender,req.body.receiver]}})
    return res.status(200).json(oldConversation);
}));


router.post('/',asyncHandler(async(req,res)=>{
     
    if(!req.body.sender || !req.body.receiver)
        return res.status(400).json({message:"sender and receiver required"})
    const oldConversation = await Conversation.findOne({members:{$all:[req.body.sender,req.body.receiver]}})
    
    if(oldConversation)
        return res.status(200).json(oldConversation)
    const newConversation = await Conversation.create({
        members:[req.body.sender,req.body.receiver]
    })
    return res.status(200).json(newConversation);
}));

router.get('/:userId',asyncHandler(async(req,res)=>{
    const conversations = await Conversation.find({
        members:{$in:[req.params.userId]}
    })

    return res.status(200).json(conversations);

}));




module.exports = router;
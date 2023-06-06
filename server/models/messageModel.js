const mongoose = require('mongoose');


const MessageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Conversation'

    },
    sender: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    receiver: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    text: {
        type: String,
        required: true
    
    },
    time:{
        type: String,
        required: true,
        default: Date.now()
    }
},{timestamps:true});



module.exports = mongoose.model('Message', MessageSchema);
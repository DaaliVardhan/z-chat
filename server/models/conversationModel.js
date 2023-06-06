const mongoose = require('mongoose');


const conversationSchema = new mongoose.Schema({
    members: {
        type: [mongoose.Types.ObjectId],
        required: true,
        ref: 'User'
    }

}, { timestamps: true,collection:"conversations" });


module.exports = mongoose.model('Conversation', conversationSchema);
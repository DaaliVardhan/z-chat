const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const mongoose =  require('mongoose');



// routes
const authRoute = require('./routes/authRoute');
const conversationRoute = require('./routes/conversationRoute');
const messageRoute = require('./routes/messageRoute');
const userRoute = require('./routes/userRoute');




mongoose.connect(process.env.MONGO_URI)

mongoose.connection.on('connected',()=>{
    console.log('connected to mongo');
})

const app = express();
app.use(express.json({extended:true}));
app.use(express.urlencoded({extended:true}));
// console.log(JSON.parse(process.env.REACT_CLIENT_URL))
app.use(cors({
    origin: process.env.REACT_CLIENT_URL,
    credentials:true
}));
app.use('/public',express.static("public"));
app.use(cookieParser());




app.post('/api/google-login',async (req,res)=>{
    const  { token } = req.body;
    const ticket = await client.verifyIdToken({ idToken:token,
    audience: process.env.GOOGLE_CLIENT_ID

})


const { name,email,picture } = ticket.getPayload();


upsert(users,{name,email,picture});
res.status(200).json({name,email,picture});


});

app.get("/",(req,res)=>{
    res.status(200).json({message:"Hello World"});
})

app.use('/api/auth',authRoute);
app.use('/api/message',messageRoute)
app.use('/api/user',userRoute)
app.use('/api/conversation',conversationRoute)

const server = http.createServer(app);


const io = new Server ( server, {
    cors:{
        origins:process.env.REACT_CLIENT_URL,
        methods:["GET","POST"],
    }
})
const users = new Map();
const getUserId = (receiverId) => {
    for( const [userId,socketId] of users.entries()){
        if(socketId.includes(receiverId)){
            return userId;
        }
    }
    
}
io.on('connection',(socket)=>{
    
    socket.on('online',(userId)=>{
        prevUsers =  users.get(userId) || [];
        users.set(userId,[...prevUsers,socket.id]);
        io.emit('online',[...users.keys()]);
    })
    socket.on('disconnect',()=>{
        users.delete(getUserId(socket.id));
        io.emit('online',[...users.keys()])
       
    })

    socket.on('message',(message)=>{
        
        const socketId = users.get(message.receiver);
        
        if(socketId != null || socketId != [] || socketId != undefined){
        
            socketId.forEach(socket=>{
                
                io.to(socket).emit('message',message)
            })
            // io.to(socketId).emit('message',message);
        }
        
    })
})


server.listen(5000, () => console.log('server running on port 5000'));


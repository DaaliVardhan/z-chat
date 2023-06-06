const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const mongoose =  require('mongoose');
// const { 
//     OAuth2Client,
// } = require('google-auth-library')



// routes
const authRoute = require('./routes/authRoute');
const conversationRoute = require('./routes/conversationRoute');
const messageRoute = require('./routes/messageRoute');
const userRoute = require('./routes/userRoute');


// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

mongoose.connect(process.env.MONGO_URI)

mongoose.connection.on('connected',()=>{
    console.log('connected to mongo');
})

const app = express();
app.use(express.json({extended:true}));
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials:true
}));
app.use('/public',express.static("public"));
app.use(cookieParser());

// const users = [];

// function upsert(arr,item){
//     const i = arr.findIndex((e)=> e.id === item.id);
//     if(i > -1){
//         arr[i] = item;
//     }else{
//         arr.push(item);
//     }
// }


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
        origins:["http://localhost:5173","http://127.0.0.1:5173/","ws://localhost:5173"],
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

// const Users = [];
// const Admin = 'Admin'


// io.on('connection',(socket)=>{
//     console.log(socket.id);

//     socket.on('join_room', (data) => {
//         const {username,room} = data;
//         socket.join(room);


//         let createTime = Date.now();

//         socket.to(room).emit('receive_message', {
//             message: `${username} joined the room`,
//             username: Admin,
//             createTime,
//         });

//         socket.emit('receive_message', {
//             message: `Welcome ${username}`,
//             username: Admin,
//             createTime,
//         })

//         chatRoom = room;
//         Users.push({id:socket.id,username,room})
//         chatRoomUsers = Users.filter((user)=> user.room === room);
//         socket.to(room).emit('chatroom_users',chatRoomUsers);
//         socket.emit('chatroom_users',chatRoomUsers);

//     });
// })


server.listen(5000, () => console.log('server running on port 5000'));


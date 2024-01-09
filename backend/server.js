import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import connectDB from './config/db.js'
import colors from 'colors'
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js'
import bodyParser from 'body-parser';
import { errorHandler, notFound } from './middleware/errorMiddleware.js'
import { Server } from 'socket.io';
import path from 'path'
import http from 'http'

const app = express();
const h = http.Server(app);

dotenv.config();
connectDB();
app.use(cors());
app.use(express.json()); // to accept JSON data

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

app.use('/api/user', userRoutes); 
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);

// ------------------ Deployment ------------------

const __dirname1 = path.resolve()
if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname1,"/frontend/build")));

    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname1,"frontend","build","index.html"));
    })
}else{
    app.get("/",(req,res)=>{
        res.send("API is Running Successfully.")
    })
}

// ------------------ Deployment ------------------

app.use(notFound)
app.use(errorHandler) 

const server = h.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`.yellow.bold);
});

const io = new Server(server,{
    pingTimeout: 60000,
    cors:{
        // origin: 'http://localhost:3000',
        origin: "https://chatapp-test-frontend.vercel.app ",
        methods: ["GET", "POST"],
    }
})

io.on("connection",(socket)=>{
    console.log("connected to socket.io");

    socket.on('setup',(userData)=>{
        socket.join(userData._id)
        socket.emit('connected')
    })

    socket.on('join chat',(room)=>{
        socket.join(room) 
        console.log("User joined room." + room)
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on('new message',(newMessageReceived)=>{
        const chat = newMessageReceived.chat;
        if(!chat.users) return console.log("chat.users not defined.")

        chat.users.forEach(user =>{
            if(user._id == newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received",newMessageReceived)
        })
    })

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
      });
})
import express from 'express';
import { chats } from './data/data.js';
import dotenv from 'dotenv';
import cors from 'cors'
import connectDB from './config/db.js'
import colors from 'colors'
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js'
import bodyParser from 'body-parser';
import { errorHandler, notFound } from './middleware/errorMiddleware.js'
import { Server, Socket } from 'socket.io';

const app = express();
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

app.use(notFound)
app.use(errorHandler) 

const server = app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`.yellow.bold);
});

const io = new Server(server,{
    pingTimeout: 60000,
    cors:{
        origin: 'http://localhost:3000'
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
})
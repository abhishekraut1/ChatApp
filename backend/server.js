import express from 'express';
import { chats } from './data/data.js';
import dotenv from 'dotenv';
import cors from 'cors'
import connectDB from './config/db.js'
import colors from 'colors'

const app = express(); 
dotenv.config();
connectDB();
app.use(cors())
 
const PORT = process.env.PORT || 5000;

app.get('/',(req,res)=>{
    res.send();
})

app.get('/api/chat',(req,res)=>{
    res.send(chats);
})

app.get('/api/chat/:id',(req,res)=>{
    const singleChat = chats.find((c) => c._id === req.params.id);
    res.send(singleChat);
})

app.listen(PORT,()=>{
    console.log(`Listening at port ${PORT}` .yellow.bold);
});
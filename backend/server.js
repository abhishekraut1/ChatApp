import express from 'express';
import { chats } from './data/data.js';
import dotenv from 'dotenv';
import cors from 'cors'
import connectDB from './config/db.js'
import colors from 'colors'
import userRoutes from './routes/userRoutes.js';
import bodyParser from 'body-parser';
import { errorHandler, notFound } from './middleware/errorMiddleware.js'

const app = express();
dotenv.config();
connectDB();
app.use(cors());
app.use(express.json()); // to accept JSON data

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

app.use('/api/user', userRoutes);

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`.yellow.bold);
});
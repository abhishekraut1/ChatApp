import expressAsyncHandler from "express-async-handler";
import Message from '../models/messageModel.js'
import User from "../models/userModel.js";
import Chat from "../models/chatModel.js";

// post request
export const sendMessage = expressAsyncHandler(async (req, res) => {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        console.log("Invalid data passed into request!");
        return res.sendStatus(400);
    }

    const newMassage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }

    try {
        let message = await Message.create(newMassage);
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name email pic"
        })

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message
        })

        res.json(message)
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }

})

// get request
export const allMessages = expressAsyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name pic email")
            .populate("chat")

        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }

})
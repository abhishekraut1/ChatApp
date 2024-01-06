import expressAsyncHandler from "express-async-handler";
import Chat from '../models/chatModel.js'
import User from "../models/userModel.js";

// create chat
const accessChat = expressAsyncHandler(async (req, res) => {
    const { userId } = req.body;
    // console.log(userId)
    if (!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
            );
            res.status(200).json(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});

const fetchChats = expressAsyncHandler(async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (result) => {
                result = await User.populate(result, {
                    path: "latestMessage.sender",
                    select: "name pic email",
                });
                res.status(200).send(result);
            })

    } catch (error) {
        res.status(400);
        return new Error(error.message);
    }
});

const createGroupChat = expressAsyncHandler(async (req, res) => {
    if (!req.body.name || !req.body.users) {
        res
            .status(400)
            .send({ message: "Please provide all the fields." })
    }

    const users = JSON.parse(req.body.users);
    // users.push(req.user);

    if (users.length < 3) {
        res
            .status(400)
            .send({ message: "More than 2 users are required to form Group Chat." })
    }

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        })

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

const renameGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;
    if (!chatId || !chatName) {
        res.status(400).send({ message: "Please provide all the fields." })
    }

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName
        },
        {
            new: true
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")


    if (!updatedChat) {
        res.status(400)
        throw new Error("Chat Not Found.")
    } else {
        res.json(updatedChat);
    }

})

const addToGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
        res.status(400)
        send({ message: "Please provide all the fields." })
    }

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId }
        },
        {
            new: true
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (!added) {
        res.status(400)
        throw new Error("Chat Not Found.")
    } else {
        res.json(added);
    }
})

const removeFromGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
        res.status(400)
        send({ message: "Please provide all the fields." })
    }

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId }
        },
        {
            new: true
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (!removed) {
        res.status(400)
        throw new Error("Chat Not Found.")
    } else {
        res.json(removed);
    }
})

export { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup };
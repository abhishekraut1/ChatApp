import expressAsyncHandler from "express-async-handler";
import User from '../models/userModel.js'
import generateToken from "../config/generateToken.js";

const registerUser = expressAsyncHandler (async (req,res)=>{
    const {name, email, password, pic} = req.body;

    if(!name || !email || !password){
        res.send(400);
        throw new Error("Please enter all the fields.") 
    }

    const userExists = await User.findOne({ email }); 

    if(userExists){
        res.status(400);
        throw new Error("User already exists.")
    }
    
    const user = await User.create({
        name,
        email,
        password,
        pic,
    })

    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        })
    }else{
        res.status(400);
        throw new Error("Failed to create user.")
    }
});

const authUser = expressAsyncHandler (async (req,res)=>{
    const {email, password} = req.body;
    const user = await User.findOne({email});
    
    if(user && (await user.matchPassword(password))){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        })
    }else{
        res.status(401);
        throw new Error("Invalid Email or Password.")
    }
});

export {registerUser, authUser};
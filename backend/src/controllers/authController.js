const User = require('../models/User');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError')
const asyncHandler = require("../middleware/asyncHandler")
const jwt = require("jsonwebtoken")

exports.register =  asyncHandler(async (req, res, next)=>{
        const {name, email, password, role} = req.body;

        if(!name || !email || !password){
            throw new AppError('All fields are required', 400);
        }

        const existingUser = await User.findOne({ email })
        if(existingUser){
            throw new AppError('Email already registered', 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        res.status(201).json({
            message: "User registered successfully!",
            name: name,
            email: email,
            id: user._id,
            role: user.role
        })
        console.log("User "+name+" registered sucessfully");

});

exports.login = async (req, res, next) =>{
    const {email, password} = req.body;

    if(!email || !password){
        res.status(400).json({message: "All fields required"});
        return; 
    }

    const user = await User.findOne({email})

    if(user){
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch){
            let token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {expiresIn:"1h"})
            res.status(200).json({
                message: "Login succssful! Welcome "+user.name,
                token
            })
        }
        else {
            res.status(401).json({
                message: "Incorrect credentials, please try again!"
            })
        }
    }
    else {
        throw new AppError("Invalid credentials", 401)
    }

}
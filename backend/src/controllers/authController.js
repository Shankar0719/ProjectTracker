const User = require('../models/User');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError')

exports.register = async (req, res, next)=>{
    try{
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


    }
    catch(err){
        next(err);
    }
}
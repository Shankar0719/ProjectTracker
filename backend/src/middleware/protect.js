const User = require("../models/User");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");


exports.protect = asyncHandler(async (req, res, next) =>{
    const auth = req.headers.authorization;
    if(!auth || !auth.startsWith("Bearer ")){
        throw new AppError("Unauthorized", 401);
    }
    const token = auth.split(" ")[1];
    if(!token){
        throw new AppError("Unauthorized", 401);
    }
    let decoded;
    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    }
    catch(err){
        throw new AppError("Unauthorized", 401);
    }
    const user = await User.findById(decoded.id).select("-password");
    if(!user){
        throw new AppError("Unauthorized", 401);
    }
    req.user = user;
    next()
})
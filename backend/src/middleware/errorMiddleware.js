const errorHandler = (err, req, res, next)=>{
    
    if(process.env.NODE_ENV==="development"){
        console.error(err);
    }

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        errorStack: process.env.NODE_ENV==="development"?err.stack:null
    });
};

module.exports = errorHandler;
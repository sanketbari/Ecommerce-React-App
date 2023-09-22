const Errorhandler = require("../utils/errorHandler");



module.exports = (err,req,res,next) => {
    err.statusCode = Errorhandler.err.statusCode || 500;
    err.message = Errorhandler.err.message || "Internal server error";

    //Wrong mongodb Id error
    if(err.name == "CastError"){
        const message = `Message not found. Invalid: ${err.path} `;
        err = new Errorhandler(message,404);
    }


      //Mongoose duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new Errorhandler(message,400);
    }

    //Wrong JWT Error
    if(err.name === "JsonWebTokenError"){
        const message = `Json Web Token is invalid, Try again`;
        err = new Errorhandler(message,400);
    }
    
    //JWT token expire error
    if(err.name === "TokenExpiredError"){
        const message = `Json Web Token is Expired, Try again`;
        err = new Errorhandler(message,400);
    }


    console("In error.js *********************************************************************************");
    res.status(err.statusCode).json({
        success: false,
        error: err.stack,
    });


  

}

// const middleWare = (err,req,res,next)=>{
//     let err = new Error();
//     err.status = 404;
//     next(err);
// } 






const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");  //Inbuilt module no need to install

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"Please enter your name"],
        maxLength : [15,"Please enter less than  15 characters"],
        minLength : [4,"Please enter more than  4 characters"]
    },
    email:{
        type: String,
        required: [true,"Please enter your email"],
        unique: true,
        //validate: [validator.isValid,"Please enter valid email address"],
        validate: {
            validator: (value) => {
                return validator.isEmail(value); // Use validator's isEmail method to validate email
            },
            message: "Please enter a valid email address"
        }
       
    },
    password:{
        type: String,
        required: [true,"Please enter the password"],
        minLength: [5,"Password should be greater than 5 characters"],
        select: false, //find() should not select password to show when all data is queried
    },
    avatar:{
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        }
    },
    role:{
        type:String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    
});


userSchema.pre("save",async function(next){   //This is a event now that means do something 'pre' save 

    if(!this.isModified("password")){  // we want to update password separetly so when other fields are being updated it should not hash the password again coz it is anyways already hashed while creating and saving password in database
        next();
    }

    this.password = await bcrypt.hash(this.password,10);
})  


//JWT Token
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id: this._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE
    })
}


//password compare
userSchema.methods.passwordCompare = async function(password){
    return await bcrypt.compare(password,this.password);
}


//generating password reset token

userSchema.methods.getResetPasswordToken = function(){
    
    //Generating token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //Hashing and adding resetPasswordToken to userSchema

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15*60*1000;

    return resetToken;
}




module.exports = mongoose.model("user",userSchema);

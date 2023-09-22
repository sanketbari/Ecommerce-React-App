const Errorhandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwttoken");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");
//Register a user  -- creating user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "This is a demo public id",
      url: "Demo URL",
    },
  });

  //Below code before writing it in a function

  // const token = user.getJWTToken();

  // res.status(201).json({
  //     success: true,
  //     user,
  //     token
  // })

  //Below code after writing it in a function
  sendToken(user, 201, res);
});

//Login user

exports.userLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //Checking if both email and password are entered
  if (!email || !password) {
    return next(
      new Errorhandler("Please provide both email and password", 400)
    );
  }

  //checking the email and password present in database

  const user = await User.findOne({ email }).select("+password"); // we could have given {email:email} but as both key and value having same name so only one time we specified
  // select method of mongoose here is like where clause of SQL it filters the query result
  //+password is used because previously in schema we specified select: false,so that find() method will not select but bcoz of + here it will select it

  if (!user) {
    return next(new Errorhandler("Invalid email or password", 401)); //unauthorised
  }

  const isPasswordMatched = await user.passwordCompare(password);

  //if password not matched
  if (!isPasswordMatched) {
    return next(new Errorhandler("Invalid email or password", 401)); //unauthorised
  }

  //if password matched

  //Below code before writing it in a function

  // const token = user.getJWTToken();

  // res.status(200).json({
  //     success:true,
  //     token
  // })

  //Below code after writing it in a function
  sendToken(user, 200, res);
});

//Logout user

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Looged out",
  });
});

//Forgot password

exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new Errorhandler("User not found", 404));
  }

  //Generate resetPasswordToken

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false }); // user was already created and after assigning value to resetPasswordToken and resetPasswordExpire we need to save

  //http://localhost/api/v1/password/reset/${resetToken}
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your requested password reset token is: \n\n${resetPasswordUrl}.\n\n Please ignore if not requested by you`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Eccomerce password recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Reset password email sent successfully to ${user.email}`,
    });
  } catch (error) {
    this.resetPasswordToken = undefined; //if some error occurs while resetting the password wher link was sent over mail or error occur while sending the mail then update this as undefine
    this.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false }); //save undefined

    next(new Errorhandler(error.message, 500));
  }
};


//Password reset
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  //creating token hash coz in database we have stored hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  //finding the user in the database using resetPasswordToken filter

  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },  //resetPasswordExpiry time should be greater than current time so that password can be resetted
  });

  if(!user){
    return next(new Errorhandler("Reset password token is invalid or has been expired",404));
  }

  if(req.body.password !== req.body.confirmPassword){
    return next(new Errorhandler("Password doesn't match",400));
  }

  user.password = req.body.password;

  this.resetPasswordToken = undefined; //once password is changed by user then again make resetPasswordToken and resetPasswordExpire as undefined
  this.resetPasswordExpire = undefined;

  await user.save( { validateBeforeSave: false});

  sendToken(user,200,res); //logging in user again

});


//get user details

exports.getUserDetails = catchAsyncErrors(async (req,res,next)=>{
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user
  })
});


//Change password 

exports.changePassword = catchAsyncErrors(async (req,res,next)=>{
  const user = await User.findById(req.user._id).select("+password");

  const isPasswordMatched = await user.passwordCompare(req.body.oldPassword);

  //if password not matched
  if (!isPasswordMatched) {
    return next(new Errorhandler("Old Password is incorrect", 400)); //unauthorised
  }


  if(req.body.newPassword !== req.body.confirmPassword){
    return next(new Errorhandler("passwords doesn't match", 400));
  }

  user.password = req.body.newPassword;
  await user.save();
  sendToken(user,200,res);

});


//update profile
exports.updateProfile = catchAsyncErrors(async (req,res,next)=>{

  const newUserData={
    name: req.body.name,
    email: req.body.email

  }

  //we will use clodinary later for avatar update

  const user =await User.findByIdAndUpdate(req.user._id,newUserData,{
    new:true,
    runValidators: true,
    useFindAndModify: false
  })

  res.status(200).json({
    success: true,
    user
  });
})


//get all users -- admin

exports.getAllusers = catchAsyncErrors(async (req,res,next)=>{

  const users = await User.find();  //this will give all users in the collection

  res.status(200).json({
    success: true,
    users
  })

});
  //get single user detail -- admin

exports.getSingleUserAdmin = catchAsyncErrors( async (req,res,next)=>{

  const user = await User.findById(req.params.id);

  if(!user){
    return next(new Errorhandler(`user with id ${req.params.id} doesn't exist`));
  }

  res.status(200).json({
    success: true,
    user
  })


})


//admin can update profile of any user
exports.updateUserByAdmin = catchAsyncErrors(async (req,res,next)=>{

  const newUserData={
    name: req.body.name,
    email: req.body.email,
    role: req.body.role

  }

  //we will use clodinary later for avatar update

  const user =await User.findByIdAndUpdate(req.params.id,newUserData,{
    new:true,
    runValidators: true,
    useFindAndModify: false
  })

  res.status(200).json({
    success: true,
    user
  });
})




//admin can delete user
exports.deleteUser = catchAsyncErrors(async (req,res,next)=>{

  const user = await User.findById(req.params.id);

  //we will delete cloudnary

  if(!user){
    return next(new Errorhandler(`User with id ${req.params.id} does not exist`));
  }

  await user.deleteOne();
  res.status(200).json({
    success: true,
    user
  });
})
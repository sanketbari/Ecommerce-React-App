const jwt = require("jsonwebtoken");
const Errorhandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new Errorhandler("Please login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);

  next();
});

exports.authorizedRoles = (...roles) =>  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new Errorhandler(
        `The user with role ${req.user.role} is not allowed to access this resource`,403
      ));
    }

    next();
};


const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Errorhandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

//creating the order

exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;


  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
 });

 res.status(201).json({
    success: true,
    order,
 })
});


//get single order

exports.getSingleOrder = catchAsyncErrors(async (req,res,next)=>{

    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
        );//The extra populate function will take the userId and go to user database and populate name and email of the user instead of userId

    if(!order){
        return next(new Errorhandler(`Order with id ${req.params.id} does not exist`,404));
    }

    res.status(200).json({
        success: true,
        order
    })
})


//get logged in users order

exports.myOrders = catchAsyncErrors(async (req,res,next)=>{

    const orders = await Order.find({user: req.user._id});

    res.status(200).json({
        success: true,
        orders,
    })
})


//get all orders --admin

exports.allOrders = catchAsyncErrors(async (req,res,next)=>{

    const orders = await Order.find();

    //finding totalAmount so that we can show to admin at dashboard
    let totalAmount = 0;
    orders.forEach(ord=> {
        totalAmount = totalAmount + ord.totalPrice;
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    })
})


//update order status  --Admin

exports.updateOrder = catchAsyncErrors(async (req,res,next)=>{

    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new Errorhandler("order not found",404));
    }

    if(order.orderStatus === "Delivered"){
        return next(new Errorhandler("You have already delivered this order",400));
    }

    //update order stock like quantity
    order.orderItems.forEach(async ord =>{
        await updateStock(ord.product,ord.quantity);
    })

    order.orderStatus = req.body.status;

    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now();
    }

    await order.save({validateBeforeSave: false});

    res.status(200).json({
        success:true
    })

})

async function updateStock(id,quantity){
    const product = await Product.findById(id);

    product.stock = product.stock - quantity;

    await product.save({validateBeforeSave: false});


}

//delete orders

exports.deleteOrder = catchAsyncErrors(async (req,res,next)=>{

    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new Errorhandler("order not found",404));
    }

    await order.deleteOne();

    res.status(200).json({
        success: true,
        message: "Order deleted successfully"
    })




})
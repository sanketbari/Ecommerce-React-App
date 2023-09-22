const Product = require("../models/productModel");
const Errorhandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

//create a product -- Admin

//Below code before catchAsync implementation
// exports.createProduct = async (req,res,next)=>{
//     const product = await Product.create(req.body);
//     res.status(201).json({
//         success: true,
//         product
//     })
// }

//Below code After catchAsync implementation
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user._id; //req.body.user(in product schema) we are assigning which user created the product

  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

//Get all products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {


  const resultPerPage = 8;
  const productCount = await Product.countDocuments();

  const apiFeatures = new ApiFeatures(Product.find(), req.query);
  apiFeatures.search().filter().pagination(resultPerPage);
  const products = await apiFeatures.query;

  // const product = await Product.find();// code line before implementing apiFeatures

  res.status(200).json({
    success: true,
    products,
    productCount
  });
});

//Get product details -- single product

exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  // return res.status(500).json({
  //     success:false,
  //     message: "Product not found"
  // })

  if (!product) {
    //Below code was before using Error middleware
    // return res.status(500).json({
    //     success:false,
    //     message: "Product not found"
    // })

    //Below code after using Error middleware

    return next(new Errorhandler("Product Not sanketttt found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Resquested product found",
    product,
  });
});

//Update product -- Admin

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      success: false,
      message: "product not found",
    });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

//delete product -- Admin

exports.productDelete = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

//create new review or update the review

exports.createProductReviewOrUpdate = catchAsyncErrors(
  async (req, res, next) => {
    const { rating, comment, productId } = req.body; //destructured the object body

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    ); //checking if the specific user has given review so searching for the "user" review in reviews array using find() where it tries to compare userId with all the araay elements

    if (isReviewed) {
      //if the user already given review then update the review
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString()) {
          rev.rating = review;
          rev.comment = comment;
        }
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    //calculating average ratings for ratings field in productModel
    let avg = 0;

    product.reviews.forEach((rev) => {
      avg = avg + rev.rating;
    });
    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
    });
  }
);

//Get all reviews of a product

exports.getAllReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new Errorhandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

//delete product review

exports.deleteProductReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new Errorhandler("Product not found", 404));
  }

  //storing reviews which we want so that automatically the reviews which we do not want will be deleted
  //The filter() method is an iterative method. It calls a provided callbackFn function once for each element in an array, and constructs a new array of all the values for which callbackFn returns a truthy value. Array elements which do not pass the callbackFn test are not included in the new array.
  const reviews = await product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  //calculating average rating again coz some review is deleted

  let avg = 0;

  reviews.forEach((rev) => {
    avg = avg + rev.rating;
  });

  const ratings = avg / reviews.length;

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(req.query.productId, {
    reviews,
    ratings,
    numOfReviews,
  },
  {
    runValidators:true,
    new: true,
    useFindAndModify:false
  });

  res.status(200).json({
    success: true,
  });
});

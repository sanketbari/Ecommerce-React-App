const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  productDelete,
  getProductDetails,
  createProductReviewOrUpdate,
  getAllReviews,
  deleteProductReview,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProducts);
router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizedRoles("admin"), createProduct); //only admin should be able to create product

router
  .route("admin/product/:id")
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateProduct) //only admin should be able to update product
  .delete(isAuthenticatedUser, authorizedRoles("admin"), productDelete); //only admin should be able to delete product;

router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAuthenticatedUser, createProductReviewOrUpdate);

router.route("/reviews").get(getAllReviews).delete(isAuthenticatedUser,deleteProductReview);

// router.route("/product/:id").delete(productDelete);

module.exports = router;

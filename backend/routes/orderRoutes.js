const express = require("express");
const {newOrder, getSingleOrder,myOrders, allOrders, updateOrder, deleteOrder} = require("../controllers/orderController");
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser,newOrder);
router.route("/order/me").get(isAuthenticatedUser,myOrders);
router.route("/order/:id").get(isAuthenticatedUser,authorizedRoles("admin"),getSingleOrder); //place route with param at last of all routes to avoid CastError: Cast to ObjectId failed for value &quot;me&quot; (type string
//don't know the reason yet

router.route("/admin/orders").get(isAuthenticatedUser,authorizedRoles("admin"),allOrders);
router.route("/admin/order/update/:id").put(isAuthenticatedUser,authorizedRoles("admin"),updateOrder);
router.route("/admin/order/delete/:id").delete(isAuthenticatedUser,authorizedRoles("admin"),deleteOrder);


module.exports = router;
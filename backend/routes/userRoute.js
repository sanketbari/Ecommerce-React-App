const express = require("express");
const {
  registerUser,
  userLogin,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  changePassword,
  updateProfile,
  getAllusers,
  getSingleUserAdmin,
  updateUserByAdmin,
  deleteUser,
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");



const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(userLogin);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthenticatedUser,getUserDetails);
router.route("/password/update").put(isAuthenticatedUser,changePassword);
router.route("/me/update").put(isAuthenticatedUser,updateProfile);
router.route("/admin/users").get(isAuthenticatedUser,authorizedRoles("admin"),getAllusers);

router.route("/admin/user/:id")
.get(isAuthenticatedUser,authorizedRoles("admin"),getSingleUserAdmin)
.put(isAuthenticatedUser,authorizedRoles("admin"),updateUserByAdmin)
.delete(isAuthenticatedUser,authorizedRoles("admin"),deleteUser);



module.exports = router;

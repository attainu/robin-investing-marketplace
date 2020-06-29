const { Router } = require("express");
const auth = require("../middleware/authenticate");
const router = Router();
const {
  loginUser,
  registerUser,
  changePassword,
  deleteAccount,
  logout,
  resetPassword,
  userprofile
} = require("../controllers/userController");

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/changepassword", auth, changePassword);
router.post("/deleteaccount", auth, deleteAccount);
router.post("/resetpassword", resetPassword);
router.delete("/logout", auth, logout);
router.get("/userprofile", auth, userprofile);

module.exports = router;

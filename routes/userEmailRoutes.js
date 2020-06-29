const { Router } = require("express");
const router = Router();
const {
    confirmEmail, 
    regenerateRegisterToken, 
    sendForgotPasswordEmail, 
    resetEmailConfirmation} = require("../controllers/userEmailController");


router.get("/confirm/:confirmToken", confirmEmail);
router.get("/reset/:resetToken", resetEmailConfirmation);

router.post("/regenerate", regenerateRegisterToken);//to resend email confirmation
router.post("/forgotpassword", sendForgotPasswordEmail);

module.exports = router
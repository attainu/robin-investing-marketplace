const { Router } = require("express");
const router = Router();
const auth = require("../middleware/authenticate");
const {
  getMutualFunds,
  searchMutualFunds,customSearch,addSaveTransac
} = require("../controllers/mutualFundsController");


router.get("/mutualfunds/:number", getMutualFunds); //by number of results
router.get("/mutualFundsBySchemeId", searchMutualFunds); //by family name
router.get('/mutualFundsCustom',customSearch) //custom searh by either one term in req.body




//save add transaction final in mutual funds
router.post("/saveaddtrans",auth,addSaveTransac)

module.exports = router;

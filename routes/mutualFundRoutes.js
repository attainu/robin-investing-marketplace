const { Router } = require("express");
const router = Router();
const auth = require("../middleware/authenticate");
const {
  getMutualFunds,
  searchMutualFunds,customSearch,addSaveTransac,showHoldings,showTransactions
} = require("../controllers/mutualFundsController");


router.get("/mutualfunds/:number", getMutualFunds); //by number of results
router.get("/mutualFundsBySchemeId", searchMutualFunds); //by family name
router.get('/mutualFundsCustom',customSearch) //custom searh by either one term in req.body




//save add transaction final in mutual funds
router.post("/saveaddtrans",auth,addSaveTransac)
router.get("/MutualFundHoldings",auth,showHoldings) //Shows current MF holding a user has
router.get("/MutualFundTransactions",auth,showTransactions)//shows MF transaction history of the user

module.exports = router;

const { Router } = require("express");
const router = Router();
const auth = require("../middleware/authenticate");
const {
  getMutualFunds,
  searchMutualFunds,customSearch,mutualFundTransaction,samplePerform,addSaveTransac
} = require("../controllers/mutualFundsController");


router.get("/mutualfunds/:number", getMutualFunds); //by number of results
router.get("/mutualFundsBySchemeId", searchMutualFunds); //by family name
router.get('/mutualFundsCustom',customSearch) //custom searh by either one term in req.body


// //performing transactions in mutual funds
// router.post("/mutualFundTransact/",mutualFundTransaction)//req.body-->SchemeID and and no of units to buy and transaction type->buy or sell


// //perform and strore transaction
// router.post("/samplePreform/",auth,samplePerform)


//save add transaction final in mutual funds
router.post("/saveaddtrans",auth,addSaveTransac)

module.exports = router;

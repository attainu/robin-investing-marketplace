var express = require('express');
var router = express.Router();
var auth = require('../middleware/authenticate');
var walletController = require('../controllers/walletController');


router.get('/wallet', walletController.renderWalletPage);

router.get('/wallet/addFunds', walletController.renderAddFundsPage);
// can add funds in form of USD only. coz thats what is available.

router.post('/wallet/addFunds/', walletController.addFunds);
// updates wallet and adds new transactoin.

//add wallet to the registered user
router.post('/addWallet',auth, walletController.addWallet) //added1

module.exports = router;

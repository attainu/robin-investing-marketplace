var express = require('express');
var router = express.Router();
var auth = require('../middleware/authenticate');
var walletController = require('../controllers/walletController');


router.get('/wallet',auth, walletController.renderWalletPage);

router.get('/wallet/addFunds',auth, walletController.renderAddFundsPage);
// can add funds in form of USD only. coz thats what is available.

router.post('/wallet/addFunds/',auth, walletController.addFunds);
// updates wallet and adds new transactoin.

//add wallet to the registered user
router.post('/addWallet', auth, walletController.addWallet) //added1

module.exports = router;

var express = require('express');
var router = express.Router();
var auth = require('../middleware/authenticate');
var currencyExController = require('../controllers/currencyExController');

router.get('/CurrencyExchange', auth, currencyExController.renderCurrencyExchangePage);

router.get('/CurrencyExchange/:coinId', auth, currencyExController.renderCoinDetailsPage);

router.get('/CurrencyExchange/transaction/:coinId', auth, currencyExController.renderTransactionPage);

router.post('/CurrencyExchange/transaction/:coinId', auth, currencyExController.addTransaction);
// the same transaction route can be used to both sell or buy a particular currency.
// this is because we are essestially just exchanging Currencies in both the cases.
// 1) buying a BTC: baseCurr: USD and exCurr: BTC
// 2) selling a BTC: baseCurr: BTC and exCurr: USD

module.exports = router;

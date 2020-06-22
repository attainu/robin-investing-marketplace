var express = require('express');
var router = express.Router();
var auth = require('../middleware/authenticate');
var currencyExController = require('../controllers/currencyExController');

router.get('/CurrencyExchange', auth, currencyExController.renderCurrencyExchangePage);

router.get('/CurrencyExchange/:coinId', auth, currencyExController.renderCoinDetailsPage);

router.get('/CurrencyExchange/transaction/:coinId', currencyExController.renderTransactionPage);

router.post('/CurrencyExchange/transaction/:coinId', currencyExController.addTransaction);

module.exports = router;

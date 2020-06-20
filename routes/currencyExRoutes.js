var express = require('express');
var router = express.Router();
var auth = require('../middleware/authenticate');
var currencyExController = require('../controllers/currencyExController');

router.get('/CurrencyExchange', auth, currencyExController.renderCurrencyExchangePage);

router.get('/CurrencyExchange/:coinId', auth, currencyExController.renderCoinDetailsPage);

router.get('/CurrencyExchange/transaction/:coinId', auth, currencyExController.renderTransactionPage);

router.post('/CurrencyExchange/transaction/:coinId', auth, currencyExController.addTransaction);

module.exports = router;

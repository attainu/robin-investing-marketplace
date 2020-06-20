var Coins = require('../models/Coins');

module.exports = {
  renderCurrencyExchangePage: function (req, res) {
    Coins.find()
    .then(function (coins){
      return res.json(coins);
    })
    .catch(function (err){
      console.log(err.message);
      return res.status(500).send("Server Error");
    });
  },
  renderCoinDetailsPage: function (req, res){
    var coinId = req.params.coinId;
    Coins.findById(coinId)
    .then(function (coin){
      return res.json(coin);
    })
    .catch(function (err) {
      return res.status(500).send(`Server Error${err.message}`);
    });
  },
  renderTransactionPage: function (req, res){
    var coinId = req.params.coinId;

    Coins.find({
      symbol: "USD"
    })
    .then(function (USD){
      var usd = USD;

      Coins.findById(coinId)
      .then(function (coin){
        var data = [];
        data.push(coin);
        data.push(usd[0]);
        res.json(data);
      })
      .catch(function (err){
        return res.status(500).send(`Server Error${err.message}`);
      });
      // return res.send('done');
    })
    .catch(function (err){
      return res.status(500).send(`Server Error${err.message}`);
    })
  },
  addTransaction: function (req, res){
    res.send('transaction successful');
  }
};

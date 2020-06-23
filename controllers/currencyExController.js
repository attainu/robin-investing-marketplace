var Coins = require('../models/Coins');
var Transaction = require('../models/Transactions');
var Wallet = require('../models/Wallet');

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
    var coinId = req.params.coinId; //body
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
  addTransaction: async function(req, res){
    // var user = req.user;
    // var userId = req.session.userId; //5eef6ba49b64f84ddc4936ec
    var userId = "5eef6ba49b64f84ddc4936ec";
    var BaseCurr = req.body.BaseCurr;
    var ExCurr = req.body.ExCurr;
    var BaseAmt = req.body.BaseAmt;
    var ExAmt = req.body.ExAmt;
    var newCurr = {coin: ExCurr, balance: ExAmt};

    // if(!user)
    //   return res.status(406).json({success: false, error: `Authentication Error`});
    if (!userId)
      return res.status(406).json({success: false, error: `User ID not found`});

    // updating wallet
    const wallets = await Wallet.find(
      { User: userId}
    );
    if(!wallets || wallets.length === 0)
      return res.status(406).json({success: false, error: `No wallet found in our records with requested id ${userId}`});

    const wallet = wallets[0];

    // adding new currency/ updating existing currency
    const ExIndex = wallet.Currencies.findIndex(function(obj){
      return obj.coin == ExCurr;
    });
    if(!ExIndex){
      wallet.Currencies.push(newCurr);
    }
    else{
      wallet.Currencies[ExIndex].balance = (wallet.Currencies[ExIndex].balance + ExAmt);
    }

    // finding index of base currency
      const BaseIndex = wallet.Currencies.findIndex(function(obj){
        return obj.coin == BaseCurr;
      });
      wallet.Currencies[BaseIndex].balance = (wallet.Currencies[BaseIndex].balance - BaseAmt);
      await wallet.save()
      .then(function(wallet){
          res.json(wallet);
      })
      .catch(function (err){
        return res.status(406).json({success: false, error: `Server Error`});
      });


    // creating new transaction object

    var transaction = new Transaction({
      User: userId,
      Amount: BaseAmt,
      Type: req.body.Type,
      Category: req.body.Category,
      TransactionDate: Date.now()
    });

    // saving the new transaction
    await transaction.save()
    .then(function(transaction){
      console.log(transaction);
    })
    .catch(function (err){
      if(err.name === "Validation Error")
        return res.status(400).json({success: false, error: `Validation Error: ${err.message}`});
      console.log(err);
      return res.status(500).json({success: false, error: "Server Error"});
    });

  }
};

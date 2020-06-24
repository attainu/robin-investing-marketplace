var Coins = require('../models/Coins');
var Transaction = require('../models/Transactions');
var Wallet = require('../models/Wallet');

module.exports = {
  renderWalletPage: async function (req, res) {
    // const userId = req.session.userId;
    var userId = "5eef6ba49b64f84ddc4936ec";
    const wallets = await Wallet.find({
      User: userId
    });
    if(!wallets || wallets.length === 0)
      return res.status(406).json({success: false, error: `No wallet found in our records with requested id ${userId}`});

    const wallet = wallets[0];

    res.json(wallets);
  },
  renderAddFundsPage: async function (req, res){
    Coins.find({
      symbol: "USD"
    })
    .then(function (USD) {
      res.json(USD);
    })
    .catch(function(err){
      return res.status(500).send(`Server Error${err.message}`);
    });
  },
  addFunds: async function (req, res){
    // const userId = req.session.userId;
    var userId = "5eef6ba49b64f84ddc4936ec";
    var BaseCurr = req.body.BaseCurr;
    var BaseAmt = req.body.BaseAmt;
    var newCurr = {coin: BaseCurr, balance: BaseAmt};


    const wallets = await Wallet.find(
      { User: userId}
    );
    if(!wallets || wallets.length === 0)
      return res.status(406).json({success: false, error: `No wallet found in our records with requested id ${userId}`});

    const wallet = wallets[0];

    // adding new currency/ updating existing currency
    const index = wallet.Currencies.findIndex(function(obj){
      return obj.coin == BaseCurr;
    });
    if(index<0){
      wallet.Currencies.push(newCurr);
    }
    else{
      wallet.Currencies[index].balance = (wallet.Currencies[index].balance + BaseAmt);
    }
    // saving updates to wallet
          await wallet.save()
          .then(function(wallet){
              res.json(wallet);
          })
          .catch(function (err){
            return res.status(406).json({success: false, error: `Server Error`});
          });

    // creating new transation object
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

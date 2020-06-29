var Coins = require('../models/Coins');
var Transaction = require('../models/Transactions');
var Wallet = require('../models/Wallet');


module.exports = {
  // ---------------------------------------------------------------------------
  renderCurrencyExchangePage: async (req, res) => {
    await Coins.find()
    .then((coins) => {
      return res.json(coins);
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ success: false, error: `Server Error: ${err.message}`});
    });
  },
  //----------------------------------------------------------------------------
  renderCoinDetailsPage: async(req, res) => {
    var coinId = req.params.coinId; //body
    await Coins.findById(coinId)
    .then((coin) => {
      return res.json(coin);
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: `Server Error: ${err.message}`});
    });
  },
  // ---------------------------------------------------------------------------
  renderTransactionPage: async (req, res) => {
    var coinId = req.params.coinId;

    await Coins.find({
      symbol: "USD"
    })
    .then((USD) => {
      var usd = USD;
      Coins.findById(coinId)
      .then((coin) => {
        var data = [];
        data.push(coin);
        data.push(usd[0]);
        res.json(data);
      })
      .catch((err) => {
        return res.status(500).json({ success: false, error: `Server Error: ${err.message}`});
      });
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: `Server Error: ${err.message}`});
    })
  },
  // ---------------------------------------------------------------------------
  addTransaction: async (req, res) => {
    var userId = req.session.userId; //5eef6ba49b64f84ddc4936ec
    var BaseCurr = req.body.BaseCurr;
    var ExCurr = req.body.ExCurr;
    var BaseAmt = req.body.BaseAmt;
    var ExAmt = req.body.ExAmt;
    var newCurr = {coin: ExCurr, balance: ExAmt};

    if (!userId)
      return res.status(406).json({success: false, error: `User ID not found`}); //may need to change the error message

    // updating wallet
    const wallets = await Wallet.find(
      { User: userId}
    );
    if(!wallets || wallets.length === 0)
      return res.status(406).json({success: false, error: `No wallet found in our records with requested id ${userId}`});

    const wallet = wallets[0];


//finding index of ExCurrency
    const ExIndex = wallet.Currencies.findIndex((obj) => {
      return obj.coin == ExCurr;
    });

// finding index of base currency
      const BaseIndex = wallet.Currencies.findIndex((obj) => {
        return obj.coin == BaseCurr;
      });

// checking if BaseAmt is greater than the available balance in the wallet
if(BaseAmt>wallet.Currencies[BaseIndex].balance)
  return res.status(406).json({success: false, error: `BaseAmt exceeds the balance in the wallet with requested id ${userId}`});

// adding new currency/ updating existing currency
    if(!ExIndex){
      wallet.Currencies.push(newCurr);
    }
    else{
      wallet.Currencies[ExIndex].balance = (wallet.Currencies[ExIndex].balance + ExAmt);
    }

// updating base currency
     wallet.Currencies[BaseIndex].balance = (wallet.Currencies[BaseIndex].balance - BaseAmt);

// saving updates to wallet
      await wallet.save()
      .then((wallet) => {
          res.json(wallet);
      })
      .catch((err) => {
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
    .then((transaction) => {
      console.log(transaction);
    })
    .catch((err) => {
      if(err.name === "Validation Error")
        return res.status(400).json({success: false, error: `Validation Error: ${err.message}`});
      console.log(err);
      return res.status(500).json({success: false, error: "Server Error"});
    });
  }
};

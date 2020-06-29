var Coins = require('../models/Coins');
var Transaction = require('../models/Transactions');
var Wallet = require('../models/Wallet');

module.exports = {
  renderWalletPage: async (req, res) => {
    const userId = req.session.userId;
    // var userId = "5eef6ba49b64f84ddc4936ec";
    const wallets = await Wallet.find({
      User: userId,
    });
    if (!wallets || wallets.length === 0)
      return res
        .status(406)
        .json({
          success: false,
          error: `No wallet found in our records with requested id ${userId}`,
        });

    const wallet = wallets[0];

    res.json(wallets);
  },
  renderAddFundsPage: async (req, res) => {
    Coins.find({
      symbol: "USD",
    })
      .then((USD) => {
        res.json(USD);
      })
      .catch((err) => {
        return res.status(500).send(`Server Error${err.message}`);
      });
  },
  addFunds: async (req, res) => {
    const userId = req.session.userId; //added
    // var userId = "5eef6ba49b64f84ddc4936ec";
    var BaseCurr = req.body.BaseCurr;
    var BaseAmt = req.body.BaseAmt;
    var newCurr = { coin: BaseCurr, balance: BaseAmt };

    const wallets = await Wallet.find({ User: userId });
    if (!wallets || wallets.length === 0)
      return res
        .status(406)
        .json({
          success: false,
          error: `No wallet found in our records with requested id ${userId}`,
        });

    const wallet = wallets[0];

    // adding new currency/ updating existing currency
    const index = wallet.Currencies.findIndex((obj) => {
      return obj.coin == BaseCurr;
    });
    if (index < 0) {
      wallet.Currencies.push(newCurr);
    } else {
      wallet.Currencies[index].balance =
        wallet.Currencies[index].balance + BaseAmt;
    }
    // saving updates to wallet
    await wallet
      .save()
      .then((wallet) => {
        res.json(wallet);
      })
      .catch((err) => {
        return res.status(406).json({ success: false, error: `Server Error` });
      });

    // creating new transation object
    var transaction = new Transaction({
      User: userId,
      Amount: BaseAmt,
      Type: req.body.Type,
      Category: req.body.Category,
      TransactionDate: Date.now(),
    });

    // saving the new transaction
    await transaction
      .save()
      .then((transaction) => {
        console.log(transaction);
      })
      .catch((err) => {
        if (err.name === "Validation Error")
          return res
            .status(400)
            .json({
              success: false,
              error: `Validation Error: ${err.message}`,
            });
        console.log(err);
        return res.status(500).json({ success: false, error: "Server Error" });
      });
  },
  //adding wallet to user //added1
  async addWallet(req, res) {
    var BaseCurr = req.body.BaseCurr;
    var BaseAmt = req.body.BaseAmt;
    var newCurr = { coin: BaseCurr, balance: BaseAmt };
    const currUserId = req.session.userId;
    // console.log("current user logged in -->", currUserId);
    try {
      const findWalletCheck = await Wallet.find({ User: currUserId });
      // console.log("findwallecheck--->", findWalletCheck);
      // console.log("finalcheck length",findWalletCheck.length)

      if (findWalletCheck.length!=0) {
        return res.status(400).json({
          success: false,
          error: "Logged in user already has a wallet",
        });
      }
      var addingWallet = await Wallet.create({ User: currUserId });
      addingWallet.Currencies.push(newCurr);
      await addingWallet.save();
      res.status(200).json({success:true,message:"wallet successfully added"})
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ success: false, error: "Server Error" });
    }
  },
};

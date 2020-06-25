const Users = require("../models/User");
const MutualFunds = require("../models/mutualFunds");
const mutualFundsTransactions = require("../models/mutualFundTransactions");
const MutualFundsInvestment = require("../models/mutualFundsinvestments");
var Wallet = require("../models/Wallet"); //added

module.exports = {
  async getMutualFunds(req, res) {
    // var usercurr= req.session.userId;

    //howMany stores the params to show how many results have to be shown
    var howMany = parseInt(req.params.number);
    try {
      //to show the mutual funds
      const allfunds = await MutualFunds.find({}).limit(howMany);

      res
        .status(200)
        .json({ message: "request successfull", fundDetails: allfunds });
    } catch (err) {
      console.log(err.message);
      res.json({ Error: err.message });
    }
  },



  //Search by SchemeId of Mutual Funds
  async searchMutualFunds(req, res) {
    const SchemeCode = req.query.SchemeCode;
    // console.log("scheme code visisble-->"+SchemeCode)
    try {
      const allfunds = await MutualFunds.find(
        { Scheme_Code: SchemeCode },
        { _id: 0, Date: 1, Scheme_Name: 1, Net_Asset_Value: 1, Scheme_Code: 1 }
      ).limit(10);

      res
        .status(200)
        .json({ message: "request successfull", fundDetails: allfunds });
    } catch (err) {
      console.log(err.message);
      res.json({ Error: err.message });
    }
  },



  //Custom Search
  async customSearch(req, res) {
    const {
      Mutual_Fund_Family,
      Scheme_Category,
      Scheme_Name,
      Scheme_Type,
      Scheme_Code,
      numberOfResults,
    } = { ...req.body };
    try {
      const customFunds = await MutualFunds.find({
        $or: [
          { Mutual_Fund_Family: Mutual_Fund_Family },
          { Scheme_Category: Scheme_Category },
          { Scheme_Name: Scheme_Name },
          { Scheme_Type: Scheme_Type },
          { Scheme_Code: Scheme_Code },
        ],
      }).limit(numberOfResults);

      res
        .status(200)
        .json({ message: "request successfull", fundDetails: customFunds });
    } catch (err) {
      console.log(err.message);
      res.json({ Error: err.message });
    }
  },

  async addSaveTransac(req, res) {
    const { schemeCode, noOfUnits, typeOfTransaction } = { ...req.body };
    const USDCurrId = "5eeda3289945904484e619de";//Dollar _id value
    const currUserid = req.session.userId;

// {"schemeCode":"145349", "noOfUnits":10, "typeOfTransaction":"Sell"}








    // console.log("current user logeed in id:", currUserid);

    //<<<<<<<<<<<<----------

    // Code of fetch wallet balacance to be put here and stored in 'walletSampleBalace' as a variable

    const wallets = await Wallet.find({
      User: currUserid //dummy user can be changed with session.userid
    });
    if(!wallets || wallets.length === 0)
      return res.status(406).json({success: false, error: `No wallet found in our records with requested id ${currUserid}`});

    const wallet = wallets[0];

    const index = wallet.Currencies.findIndex(function(obj){
      return obj.coin == USDCurrId;
    });
    var walletSampleBalance = wallet.Currencies[index].balance;

    // var walletSampleBalance = 10000; //fetch and store wallet details


    //------------------------------------------->>>>>>>>>>>>>>>>>>>










    try {
      const findScheme = await MutualFunds.find({ Scheme_Code: schemeCode });
      if (!findScheme) {
        res.json({
          result: fail,
          message: "No mutual fund with such Scheme Id exists",
        });
      }
      var foundScheme = findScheme[0];
      console.log("scheme deatails>>> ", foundScheme);

      const totalTransactionValue = noOfUnits * foundScheme.Net_Asset_Value;
      // add sell transction check
if(typeOfTransaction == 'Buy'){
      if (totalTransactionValue > walletSampleBalance) {
        res.json({
          result: fail,
          message:
            "wallet balance is less than transction amount you are trying to perform",
        });
      }
    }

      var mutualFindInv = await MutualFundsInvestment.findOne({
        $and: [{ "Investments.SchemeId": schemeCode }, { userId: currUserid }],
      });
      console.log("mutualfundFind -->", mutualFindInv);
      if (mutualFindInv == null) {
        mutualFindInv = [];
      }
      if (mutualFindInv.length == 0) {
        if (typeOfTransaction == "Sell") {
          res.json({
            result: "false",
            message: "You don't have Mutual fund units to sell this",
          });
        }
        var TransactionPayload = await MutualFundsInvestment.create({
          userId: currUserid,
        });
        TransactionPayload.Investments.push({
          MfId: foundScheme._id,
          SchemeId: foundScheme.Scheme_Code,
          SchmeName: foundScheme.Scheme_Name,
          UnitsBought: noOfUnits,
          Nav: foundScheme.Net_Asset_Value,
          AmountInvested: totalTransactionValue,
        });
        await TransactionPayload.save();

        console.log("transactionnpayload--->", TransactionPayload);
        // res.json({result:"success"})--uncomment for transaction
      } else if (mutualFindInv) {
        var searchExistingMf = await MutualFundsInvestment.findOne({
          $and: [
            { "Investments.SchemeId": schemeCode },
            { userId: currUserid },
          ],
        });
        console.log("searchreturns what--->", searchExistingMf);
        var existingUnits = searchExistingMf.Investments[0].UnitsBought;

        if (typeOfTransaction == "Buy") {
          var newUnits = existingUnits + noOfUnits;
          var newAmount = newUnits * searchExistingMf.Investments[0].Nav;
        }
        if (typeOfTransaction == "Sell") {
          var newUnits = existingUnits - noOfUnits;
          if (newUnits < 0) {
            res.json({
              result: "False",
              message:
                "Quantity of units selling exceeds the quantity you have",
            });
          }
          var newAmount = newUnits * searchExistingMf.Investments[0].Nav;
        }

        //update exsiting funds
        var updatethisFund = await MutualFundsInvestment.updateOne(
          { "Investments.SchemeId": schemeCode },
          {
            "Investments.$.UnitsBought": newUnits,
            "Investments.$.AmountInvested": newAmount,
          }
        );
        // console.log("updated fund values",updatethisFund);
      }








      //updating wallet blance here
      //<----------------------------------------------------------------------
      if(typeOfTransaction == "Sell"){
        wallet.Currencies[index].balance = (wallet.Currencies[index].balance + totalTransactionValue);
      }
      else if(typeOfTransaction == "Buy"){
        wallet.Currencies[index].balance = (wallet.Currencies[index].balance - totalTransactionValue);
      }

      await wallet.save()
      .then(function(wallet){
        console.log(wallet); // i have just loddeg the updated wallet here
      })
      .catch(function(err){
        return res.status(406).json({success: false, error: `Server Error`});
      });



      //   <------ deduct/add money after the transaction and update the wallet------->>>

      //------------------------------------------------------------------------------->








      //creating transaction
      const saveTransaction = await mutualFundsTransactions.create({
        User: currUserid,
        SchemeId: foundScheme.Scheme_Code,
        SchmeName: foundScheme.Scheme_Name,
        Units: noOfUnits,
        Nav: foundScheme.Net_Asset_Value,
        Amount: totalTransactionValue,
        Type: typeOfTransaction,
      });

      console.log("total Transaction value:", totalTransactionValue);
      res.json({ result: "Transaction success", message: saveTransaction });
    } catch (err) {
      console.log(err.message);
      res.json({ Error: err.message });
    }
  },
};

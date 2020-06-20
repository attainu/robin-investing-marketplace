var Coins = require('../models/Coins');

module.exports = {
  renderHomePage: function (req, res) {
    Coins.find()
    .then(function (coins){
      return res.json(coins);
    })
    .catch(function (err){
      console.log(err.message);
      return res.status(500).send("Server Error");
    });
  }
};

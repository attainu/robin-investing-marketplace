var Coins = require('../models/Coins');

module.exports = {
  renderHomePage: async (req, res) => {
    await Coins.find()
    .then((coins) => {
      return res.json(coins);
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).send("Server Error");
    });
  }
};

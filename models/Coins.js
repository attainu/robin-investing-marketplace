const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const coinSchema = new Schema({
  uuid: {
    type: String,
    required: true,
    trim: true
  },
  symbol: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    required: true,
    trim: true
  },
  iconType: {
    type: String,
    required: true,
    trim: true
  },
  iconUrl: {
    type: String,
    required: true,
    trim: true
  },
  websiteUrl: {
    type: String,
    required: true,
    trim: true
  },
  confirmedSupply: {
    type: Boolean,
    required: true
  },
  numberOfMarkets: {
    type: Number,
    required: true
  },
  numberOfExchanges: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  volume: {
    type: Number,
    required: true
  },
  marketCap: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  circulatingSupply: {
    type: Number,
    required: true
  },
  totalSupply: {
    type: Number,
    required: true
  },
  change: {
    type: Number,
    required: true
  },
  rank: {
    type: Number,
    required: true
  },
  history: [
    {
      type: Number,
      required: true
    }
  ],
  allTimeHigh: {
    price: {
      type: Number,
      required: true
    },
    timestamp: {
      type: Number,
      required: true
    }
  }
},
{collection: 'Coins'});

var Coins = mongoose.model("coins", coinSchema);

module.exports = Coins;

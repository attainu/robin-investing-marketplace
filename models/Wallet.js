var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var walletSchema = new Schema(
  {
    User: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    Currencies: [
      {
        coin: {
          type: Schema.Types.ObjectId,
          ref: 'coin'
        },
        balance: {
          type: Number,
          required: true
        }
      },
      {autoIndexId: false}
    ]
  },
  {collection: "wallets"}
);


var Wallet = mongoose.model('wallet', walletSchema);

module.exports = Wallet;

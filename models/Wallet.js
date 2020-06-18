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
      }
    ],
    transactions: [
      {
        Amount: {
          type: Number,
          required: true,
          trim: true
        },
        Type: {
          type: String,
          required: true,
          trim: true
        },
        TransactionDate: {
          type: Date,
          required: true
        }
      }
    ]
  }
);


var Wallet = mongoose.model('wallet', walletSchema);

module.exports = Wallet;

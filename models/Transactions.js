var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var transactionSchema = new Schema(
  {
    User: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
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
    Category: {
      type: String,
      required: true,
      trim: true
    },
    TransactionDate: {
      type: Date,
      required: true
    }
  }
);


var Transaction = mongoose.model('transaction', transactionSchema);

module.exports = Transaction;

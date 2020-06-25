var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var transactionSchema = new Schema(
  {
    User: {
      type: Schema.Types.ObjectId,
      ref: 'user' //change name if collection name is changed
    },
    SchemeId:{
        type:String,
        required: true,
        trim: true
    },
    SchmeName: {
        type: String,
        required: true,
        trim: true
      },
      Units:{type:Number,
        required: true,
        trim: true},
    Nav:{
        type:Number,
        required: true,
        trim: true
    },
    Amount: {
        type: Number,
        required: true,
        trim: true
      },
      Type: {  //buy or sell
        type: String,
        required: true,
        trim: true
      }},
      
      { timestamps: true }
  
    );


var mutualFundsTransactions = mongoose.model('mutualFundsTransaction', transactionSchema,'mutualFundsTransaction');

module.exports = mutualFundsTransactions;

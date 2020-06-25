const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mutualFundsInvestmentSchema =  new Schema({
        userId: {
            type: Schema.Types.ObjectId,
            ref: "users"//refering user database
        },
        Investments: [//making array of object for MF schemes
            { 
                MfId: {
                    type: Schema.Types.ObjectId,
                    ref: 'MutualFunds'
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
              UnitsBought:{type:Number,
                default: 0,
                required: true,
                trim: true},
            Nav:{
                type:Number,
                default: 0,
                required: true,
                trim: true
            },
            AmountInvested: {
                type: Number,
                default: 0,
                required: true,
                trim: true
              },
            }
        ]
        // ,
        // MutualFundValue: {//total value of all MF
        //     type: Number,
        //     default: 0
        // }
        // ,
        // numberOfMutualFunds: {//total number of MF's
        //     type: Number,
        //     default: 0
        // } 
    })
    

  
const MutualFundsInvestment = mongoose.model(
  "MutualFundsInvestment",
  mutualFundsInvestmentSchema,
  "MutualFundsInvestment"
);

module.exports = MutualFundsInvestment;
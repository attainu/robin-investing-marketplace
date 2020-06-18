var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema(
  {
    User_Details: {
      Name: {
        type: String,
        required: true,
        trim: true
      },
      Email: {
        type: String,
        required: true,
        trim: true,
        unique: true
      },
      Password: {
        type: String,
        required: true,
        trim: true
      },
      Address: {
        type: String,
        required: true,
        trim: true
      },
      PhoneNo: {
        type: String,
        required: true,
        trim: true
      },
      Photo: {
        type: String,
        trim: true,
        default: "some phone string. jpg"
      },
      EmailConfirm: {
        type: Boolean,
        default: false
      }
    },
    JWT_Token: { //look week10 day2-3 for more
      type: String,
      trim: true
    }
  },
  {timestamps: true}
);

var User = mongoose.model('user', userSchema);
module.exports User;

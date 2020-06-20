const mongoose = require('mongoose');

mongoose .connect('mongodb+srv://Shubham_Printe:Shubham_Password@june2020-qjenk.mongodb.net/Investing_Market?retryWrites=true&w=majority',
{useNewUrlParser:true,
useUnifiedTopology:true,
useCreateIndex:true } )
.then(function(){
    console.log("database connected")
})
.catch (err=>{
    console.log(`Error: ${err.message}`)
}
)

module.exports = mongoose;

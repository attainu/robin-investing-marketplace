const mongoose=require('mongoose');
mongoose .connect('mongodb://localhost:27017/attainu',
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



const mongoose=require('mongoose')
mongoose.connect(process.env.connectionString).then(res=>{
    console.log("MongoDb Connected....");
    
})
.catch(err=>{
    console.log("MongoDb connection error"+err);
    
})
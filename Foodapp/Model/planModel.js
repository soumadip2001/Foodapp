const mongoose=require('mongoose');
const emailValidator=require('email-validator');
//const bcrypt=require('bcrypt');
//const crypto=require('crypto');
const dblink='mongodb+srv://admin:Soumadip2001@cluster0.ukyyj0s.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(dblink)
.then(function(e){
   // console.log(e);
    console.log('db connect');
})
.catch(function(err){
    console.log(err);
});

const planSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        maxlength:[20,'plan name should not exceed more than 20']
    },
    duration:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:[true,'price not entered']
    },
    ratingAverage:{
        type:Number
    },
    discount:{
        type:Number,
        validate:[function(){
            return this.discount<100;
        },'discount should not exceed price']
    }
});



//model
const planModel=mongoose.model('planModel',planSchema);

//this function will run whenever this code will run
// (async function createPlan(){
//     let plan={
//         name:'superfood',
//         duration:30,
//         price:1000,
//         ratingAverage:5,
//         discount:20
//     }
//     let data=await planModel.create(plan);  
//     console.log(data);
//     //another way
//     // const doc =new planModel(plan);
//     // await doc.save();
// })();

module.exports=planModel;
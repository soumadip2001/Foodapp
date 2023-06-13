const mongoose=require('mongoose');
const emailValidator=require('email-validator');
const bcrypt=require('bcrypt');
const crypto=require('crypto');
const dblink='mongodb+srv://admin:Soumadip2001@cluster0.ukyyj0s.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(dblink)
.then(function(e){
   // console.log(e);
    console.log('db connect');
})
.catch(function(err){
    console.log(err);
});

const userschema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate: function(){
            return emailValidator.validate(this.email);
        }
    },
    password:{
        type:String,
        required:true,
        minLength:4
    },
    confirmpassword:{
        type:String,
        required:true,
        minLength:4,
        validate:function()                                     //for checking the password wheather equal or not
        {
            return this.password==this.confirmpassword;
        }
    },
    role:{
        type:String,
        enum:['admin','user','restaurantowner','deliveryboy'],
        default:'user'
    },
    profileImage:{
        type:String,
        default:'img/users/default.jpeg'
    }, 
    resetToken:String       //used for saving reset password token
});

//syntax of pre hooks and post hooks

//before save this event occur in db
// userschema.pre('save',function(){                   //this(pre) function will run first after that post will run if changes order too
//    console.log("before save of data",this);        //data can be shown using this
// });

// //after save this event occur in db
// userschema.post('save',function(doc){
//    console.log("after save of data",doc);          //data comes in a doc
// });

//this hooks removes confirm password fields 
userschema.pre('save',function(){
    this.confirmpassword=undefined;                     //undefined means it will not save in database
});

//encrypt
// userschema.pre('save',async function(){
//     let salt= await bcrypt.genSalt();
//     let hashedString=await bcrypt.hash(this.password,salt);
//     console.log(hashedString);
// })

userschema.methods.createResetToken=function(){
    //crypto    npm i crypto 
    //creating unique token
    const resetToken=crypto.randomBytes(32).toString('hex');
    this.resetToken=resetToken;
    return resetToken;

}

userschema.methods.resetTokenHandler=function(password,confirmPassword){
    this.password=password;
    this.confirmPassword=confirmPassword;
    this.resetToken=undefined;
}


//model
const userModel=mongoose.model('usermodel',userschema);


module.exports=userModel;
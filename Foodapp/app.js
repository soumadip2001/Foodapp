const express=require('express');
//const mongoose=require('mongoose');
//const emailValidator=require('email-validator');
//const userModel=require('./Foodapp/Model/usermodel');
const CookieParser=require('cookie-parser');

//const authRouter=require('./Foodapp/Router/authRouter.js');
const userRouter=require('./Router/userRouter');
const app=express();
app.use(express.json());
app.use(CookieParser());
app.listen(3000);

//app.use('/auth',authRouter);
app.use('/users',userRouter);
const planRouter=require("./Router/planRouter")
app.use('/plans',planRouter)


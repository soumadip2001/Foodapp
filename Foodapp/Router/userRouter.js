const express=require('express');
//const mongoose=require('mongoose');
//const emailValidator=require('email-validator');
   //hashing has been done in Schema 
//const CookieParser=require('cookie-parser');
//const protectRoute=require('./authhelper');
const {getUser,updateUser,deleteUser, getAllusers}=require('../Controller/UserController');
const {signup,login,isAuthorised,protectRoute, logout,forgetPassword,resetPassword}=require('../Controller/authController');
const app=express();
app.use(express.json());
//app.listen(3000);

const userRouter=express.Router();
//user ke options
userRouter.route('/:id')
.patch(updateUser)
.delete(deleteUser)

userRouter
.route('/signup')
.post(signup)        //authController

userRouter
.route('/login')
.post(login)      //authController

//profile page
userRouter.use(protectRoute)      // is logged in or not
userRouter
.route('/userProfile')
.get(getUser)

//admin specific work
userRouter.use(isAuthorised(['admin']))    //middleware
userRouter
.route('/')
.get(getAllusers)

userRouter
.route('/forgetpassword')
.post(forgetPassword)

userRouter
.route('/resetpassword/:token')
.post(resetPassword)

userRouter
.route('/logout')
.get(logout);



// const usersingnup=express.Router();
// app.use('/users',usersingnup)
// usersingnup
// .route('/')
// .get(protectroute,getUsers)
// .post(postUsers)
// .patch(updateUsers)
// .delete(deleteUsers)
// usersingnup.route('/getcookies')
// .get(getcookies)

// usersingnup.route('/setcookies')
// .get(setcookies)


//wheather user logged in or not in website
// //let flag=true;  
// function protectroute(req,res,next){
//     if(req.cookies.isLoggedIn){
//         next();
//     }
//     else{
//         return res.json({
//             message:"Operation not allowed"
//         });
//     }
// }
module.exports=userRouter;
const express = require('express');
//const mongoose=require('mongoose');
//const CookieParser=require('cookie-parser');
const userModel = require('../Model/usermodel.js');
const planModel = require('../Model/planModel');
//const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
//const { toInteger } = require('lodash');
const jwt_key = "wfegrgvcdfegefs";    //secreate key for server
//const { jwt_key } = require('../secrets')
//const jwt_key=require('../secrets');
module.exports.signup = async function signup(req, res) {
    try {
        let dataObj = req.body;
        let user = await userModel.create(dataObj);
        if (user) {
            return res.json({
                message: "user signed up",
                data: user
            });
        }
        else {
            res.json({
                message: "error while siging up"
            });
        }

    }
    catch (err) {
        res.json({
            message: err.message
        });
    }
}

//login user
module.exports.login = async function loginuser(req, res) {
    try {
        let data = req.body;
        if (data.email) {
            let user = await userModel.findOne({ email: data.email });
            if (user) {
                //bcrypt -> compare
                if (user.password == data.password) {
                    let uid = user['id'];
                    let token = jwt.sign({ payload: uid }, jwt_key);      //by default it will use this HMAC SHA256 algo as header

                    res.cookie('login', token, { httpOnly: true });              //saving cookies in browser for protecting data in database used in protect route
                    res.json({
                        message: "user had logged in",
                        userdetails: user
                    });
                }
                else {
                    res.json({
                        message: "wrong credentials"
                    });
                }
            }
            else {
                return res.json({
                    message: "no such user exits"
                });
            }
        }
        else {
            res.json({ message: "pls provide your email" });
        }
    }
    catch (err) {
        return res.json({
            message: err.message
        });
    }
}

//isAuthorised for checking user role is admin or not
module.exports.isAuthorised = function isAuthorised(roles) {   //here roles gets an array
    return function (req, res, next) {
        if (roles.includes(req.role) == true) {
            next();
        }
        else {
            // 401 - unauthorised user
            res.status(401).json({
                message: "operation not allowed"
            });
        }
    }

}

//protect route for userModel
module.exports.protectRoute = async function protectRoute(req, res, next) {
    // if(req.cookies.isLoggedIn){
    //     next();
    // }
    try {
        let token;
        if (req.cookies.login) {
            token = req.cookies.login;
            let payload = jwt.verify(token, jwt_key);
            if (payload) {
                // const user = await userModel.findById(payload.payload);
                const user = await userModel.findById(payload.payload);
                req.role = user.role;
                req.id = user.id;
                //  console.log("user id",user.id);
                next();

            }
            else {
                //for client side people
                const client = rer.get('user-Agent');
                if (client.includes("Chrome") == true) {
                    return res.redirect('/login');
                }
                res.json({
                    message: 'user not verified '
                });
            }
        }
        else {
            res.json({
                message: "Operation not allowed or pls login "
            });
            //         console.log("req came ");
        }
        //       console.log("try");
    }
    catch (err) {
        res.json({
            message: err.message
        });
        //   console.log("error");
    }
}
//protect route for planModel
//protect route for userModel
module.exports.protectRoute_for_planModel = async function protectRoute(req, res, next) {
    // if(req.cookies.isLoggedIn){
    //     next();
    // }
    try {
        let token;
        if (req.cookies.login) {
            token = req.cookies.login;
            let payload = jwt.verify(token, jwt_key);
            if (payload) {
                // const user = await userModel.findById(payload.payload);
                //const user = await planModel.findById(payload.payload);
                //req.role = user.role;
                // req.id = user.id;
                //  console.log("user id",user.id);
                next();

            }
            else {
                //for client side people
                const client = req.get('user-Agent');
                if (client.includes("Chrome") == true) {
                    return res.redirect('/login');
                }
                res.json({
                    message: 'user not verified '
                });
            }
        }
        else {
            res.json({
                message: "Operation not allowed or pls login "
            });
            //         console.log("req came ");
        }
        //       console.log("try");
    }
    catch (err) {
        res.json({
            message: err.message
        });
        //   console.log("error");
    }
}

//forgetpassword
module.exports.forgetPassword = async function forgetPassword(req, res) {
    let { email } = req.body;
    try {
        const user = await userModel.findOne({ email: email });     //second email is for line is excessing let {email}=req.body
        if (user) {      //get a doc from userModel in const user

            //createResetToken is used to create new token and save in user doc that we fetch above
            const resetToken = user.createResetToken();   //attaching a method to a user doc
            //link:- http://abc.com/resetpassword/resetToken
            let resetPasswordLink = `${req.protocol}://${req.getHost}/resetpassword/${resetToken}`;

            //send email to the user
            //nodemailer

        }
        else {
            res.json({
                message: "pls signup"
            });
        }

    }
    catch (err) {
        res.status(501).json({
            message: err.message
        });
    }
}

//resetPassword
module.exports.resetPassword = async function resetPassword(req, res) {
    try {
        let token = req.params.token;
        let { password, confirmPassword } = req.body;
        const user = await userModel.find({ resetToken: token });        // this will bring user from usermodel database using resetToken feild
        //resetpasswordHandler will save,update password in user db
        if (user) {
            user.resetPasswordHandler(password, confirmPassword);
            await user.save();      //save that user doc in db
            res.json({
                message: "user password change successfully"
            });
        }
        else {
            res.json({
                message: "user not found"
            });
        }

    }
    catch (err) {
        res.json({
            message: err.message
        });
    }
}

module.exports.logout = function logout(req, res) {
    res.cookie('login', '', { maxAge: 1 });      //means it will first go to cookie then it overwrite login and after 1millisec the cookie will expire 
    //or we can redirect this page to login
    res.json({
        message: "user logout successfully"
    });
}
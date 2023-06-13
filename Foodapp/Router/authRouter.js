const express = require('express');
//const mongoose=require('mongoose');
//const CookieParser=require('cookie-parser');
const userModel = require('../Model/usermodel.js');
//const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const jwt_key = "wfegrgvcdfegefs";    //secreate key for server
const app = express();
app.use(express.json());
// app.listen(3000,'localhost',()=>{
//     console.log("req from brower recieved to server ");
// });

//mini app
const authRoute = express.Router();
//base route /auth
app.use('/auth', authRoute);

authRoute.route('/signup')      //url:  http://localhost:3000/auth/signup
    .get(getsignup)
    .post(postsignup)

authRoute.route('/login')
    .post(loginuser)


function getsignup(req, res) {
    res.sendFile('/public/index.html', { root: __dirname });    //it shows the website in this directory
}
function postsignup(req, res) {
    let obj = req.body;
    //  console.log("backend",obj);     //{email:"s@gmail.com", name:"s pal", password:"palpalpal"}
    res.json({
        message: "user signed up",
        data: obj
    });                             //{"message":"user signed up","data":{"email":"abc@gmai.com","name":"s pal","password":"rthuefgthkk"}}
}

//module.exports.loginuser=
async function loginuser(req, res) {
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
                    return res.json({
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
        })
    }
}
module.exports = authRoute;
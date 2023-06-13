const userModel = require('../Model/usermodel.js');
module.exports.getUser = async function getUser(req, res) {
    let id = req.id;
   // console.log(id);
    let user = await userModel.findById(id);
    // let selectiveuser= await userModel.findOne({name:"abisek"});    //.find() shows all the data of the databse and .findOne({name:dip}) shows data of the user whose name is Dip
    if (user) {
        res.json({
            message:"got user",
            data:user
        });
    }
    else {
        return res.json({
            message: "user not found"
        });
    }
}

// module.exports.postUsers=async function postUsers(req,res){
//     let dataobj=req.body;
//     let user=await userModel.create(dataobj);
//     console.log("post user called ",user);
//     res.json({
//         message:"data recieved successfully ",
//         data:user
//     });
// }
module.exports.updateUser = async function updateUser(req, res) {
    try {
        let id = req.params.id;
        let datatobeupdated = req.body;
        let user = await userModel.findById(id);
        if (user) {
            const keys = [];
            for (let key in datatobeupdated)
                keys.push(key);
            for (let i = 0; i < keys.length; i++) {
                user[keys[i]] = datatobeupdated[keys[i]];
            }
            const updatedData = await user.save();
            res.json({
                message: "data updated",
                data: user          //we can also use updatedData here
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
    // let datatobeupdated=req.body;
    //let user=await userModel.findOneAndUpdate({email:"abir1@gmail.com"},datatobeupdated);
}

module.exports.deleteUser = async function deleteUser(req, res) {
    // let datatobedeleted=req.body;
    try{
        let id=req.params.id;
        let user=await userModel.findByIdAndDelete(id);
        if(user){
        // let user = await userModel.findOneAndDelete({ email: "aman111444@gmail.com" });
            res.json({
                message: "data deleted succesfully",
                data: user
            });
        }
        else{
            res.json({
                message:"user not found"
            });
        }
    }
    catch(err)
    {
        res.json({
            message:err.message
        });
    }
}
module.exports.getAllusers=async function getAllUsers(req,res){
    let user=await userModel.find();
    if(user)
    {
        res.json({
            message:"users retrived",
            data:user
        });
    }
    // else{
    //     res.json({
    //         message:"user not found"
    //     });
    // }
};


// function setcookies(req,res){
//     res.cookie('isLoggedIn',true,{maxAge:1000*60*60*24, secure:true, httpOnly:true});                  //it expires after one day because maxAge=1000*60*60*24 secure means it can be accessed from 'https' only not 'http' , httpOnly means cookies can be accessed from backend only
//     res.cookie('isPrime',true);     // from frontend can access this cookie
//     res.send('cookies has been set ');
// }
// function getcookies(req,res){
//     let cookie=req.cookies;
//     console.log(cookie);
//     res.send('cookies received')
// }
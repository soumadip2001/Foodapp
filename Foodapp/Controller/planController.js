const planModel = require('../Model/planModel');


module.exports.getAllPlans = async function getAllPlans(req, res) {
    try {
        let plan = await planModel.find();
        if (plan) {
            return res.json({
                message: 'all plans retrived',
                data: plan
            });
        }
        else {
            return res.json({
                message: 'plan not found'
            });
        }
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}
module.exports.getPlan = async function getPlan(req, res) {
    try {
        let id = req.params.id;
        let plan = await planModel.findById(id);
        if (plan) {
            return res.json({
                message: 'plan retrived',
                data: plan
            });
        }
        else {
            return res.json({
                message: 'plan not found'
            });
        }
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

module.exports.createPlan = async function createPlan(req, res) {
    try {
        let planData = req.body;
        let createdPlan = await planModel.create(planData);
        return res.json({
            message: "plan created succ3esfully",
            data: createdPlan
        });
    }

    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

module.exports.deletePlan = async function deletePlan(req, res) {
    try {
        let id=req.params.id;
        //let planData = req.body;
        let deletedPlan = await planModel.findByIdAndDelete(id);
        return res.json({
            message: "plan deleted successfully",
            data: deletedPlan
        });
    }

    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}
module.exports.updatePlan=async function updatePlan(req,res){
    try{
        let id=req.params.id;
        let datatobeupdated=req.body;
        let plan=await planModel.findById(id);
        if(plan){
        let keys=[];
        for(let key in datatobeupdated){
            keys.push(key);
        }
        for(let key in keys){
            plan[key]=datatobeupdated[key];
        }
        //doc will be save in db
        await plan.save();
        res.json({
            message:"plan updated successfully"
        });
        }
        else{
            res.json("plan not found");
        }
    }
    catch(err){
        res.status(500).json({
            message:err.message
        });
    }
}

//get top 3 plans
module.exports.top3Plans=async function top3Plans(req,res){
    try{
        let top_3plans=await planModel.find().sort({ratingAverage:-1}).limit(3); //this query will give plans in sorted order in desc and .limit(3) will give result upto top 3 results 
        return res.json({
            message:"top 3 plans",
            data:top_3plans
        });
    }
    catch(err){
        res.satus(500).json({
            message:err.message
        });
    }
}
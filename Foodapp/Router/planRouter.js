const express=require('express');
const {protectRoute_for_planModel,isAuthorised}=require('../Controller/authController');
const {getPlan,getAllPlans,createPlan,updatePlan,deletePlan, top3Plans}=require('../Controller/planController');

const planRouter=express.Router();

//own plan -> logged in necessary
planRouter.use(protectRoute_for_planModel)
planRouter.route('/:id')
.get(getPlan)

//all plans leke ayega
planRouter.route('/allPlans')
.get(getAllPlans)

//admin,restaurant owner can only create,update or delete plans
planRouter.use(isAuthorised(['admin','restaunt_owner']));
planRouter
.route('/crudPlan')
.post(createPlan)

planRouter
.route('/crudPlan/:id')
.patch(updatePlan)
.delete(deletePlan)

//top 3 plans
planRouter
.route('/top3Plans')
.get(top3Plans)

module.exports=planRouter;
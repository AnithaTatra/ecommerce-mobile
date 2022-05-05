'use strict';
const router = require("express").Router()
//const bcrypt = require("bcrypt")
const userSchema = require('../model/user.model');
const curdoprations=require('../model/crud.oprations')
var constants = require('../constants/constants.status');
const{validation} = require('../model/fieldsValidation')

router.post('/signUp',async(req,res)=>{
    try{
        const username = req.body.username;
        const email  = req.body.email;
        if(username){
            let userData = await validation.DataValidation.userSchema.findOne({username:username}).exec();
            if(userData){
                 res.json({status:constants.USER_STATUS.FAILURE_STATUS, message:constants.USER_STATUS.USER_NAME_EXISTS})
            }else{
                if(email){
                    let userEmail = await userSchema.findOne({email:email}).exec();
                    if(userEmail){
                         res.json({status:constants.USER_STATUS.FAILURE_STATUS, message:constants.USER_STATUS.PASSWORD_EXISTS})
                }       
            }
        }  
        var result=curdoprations.signupSave(req,res)
        if(result){
          res.status(200).json({status:constants.USER_STATUS.SUCCESS_STATUS,message:constants.USER_STATUS.CREATED_SUCCESS})            
    }
}
    }catch(error){
        console.log(error.message)
       res.status(400).json({status:constants.USER_STATUS.FAILURE_STATUS,message:constants.USER_STATUS.NO_DATA})  
    }
});

 router.post('/userLogin',authVerify,async(req,res)=>{
     try{
          curdoprations.loginPage(req,res)
     }catch(error){
          res.status(400).json({status:constants.USER_STATUS.FAILURE_STATUS,message:constants.USER_STATUS.NO_DATA})
     }
 });

 router.put('/userLogout/:uuid', async(req,res)=>{
     try{
         curdoprations.logoutpage(req,res)
     }catch(error){
          res.status(400).json({status:constants.USER_STATUS.FAILURE_STATUS, message:constants.USER_STATUS.NO_DATA})
     }
 });

 
module.exports = router;
'use strict';
const router = require("express").Router()
//const bcrypt = require("bcrypt")
const userSchema = require('../model/user.model');
const curdoprations=require('../model/crud.oprations')
var constants = require('../constants/constants.status');
const{validation} = require('../model/fieldsValidation')
const mailSending = require('../middleware/email')
const {authVerification} = require('../middleware/auth');

router.post('/signUp',async(req,res)=>{
    try{
        const username = req.body.username;
        const email  = req.body.email;
        if(username){
            let userData = await userSchema.findOne({username:username}).exec();
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
        const toMail = email;
        console.log("toMail..."+toMail);
        const compose={
            from:"pinkyangelqueen123@gmail.com",
            to:toMail,
            fileName:'activeemail.ejs',
            details:{
                mail:toMail
            }

        }
        let mailData = await mailSending.mailSending(compose)
    }
    }catch(error){
        console.log(error.message)
       res.status(400).json({status:constants.USER_STATUS.FAILURE_STATUS,message:constants.USER_STATUS.NO_DATA})  
    }
});

 router.post('/userLogin',authVerification,async(req,res)=>{
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

 router.get('/accountVerify/:accountVerifyStatus/:mail',async(req,res)=>{
     try{
        var accountVerifyStatus=req.params.accountVerifyStatus;
        var mail=req.params.mail;
        console.log("Mail.....",mail)
        console.log("accountVerifyStatus..",accountVerifyStatus);
        const compose={
            from:"pinkyangelqueen123@gmail.com",
            to:mail,
            fileName:'welcomePage.ejs',
    
        }
        let mailData = await mailSending.mailSending(compose)
        await userSchema.findOneAndUpdate({email:req.params.mail},{accountVerifyStatus:req.params.accountVerifyStatus},{new:true}).exec()
        res.status(200).json({status:constants.USER_STATUS.SUCCESS_STATUS,message:constants.USER_STATUS.ACCOUNT_STATUS})            

     }catch(error){
         res.status(400).json({status:constants.USER_STATUS.FAILURE_STATUS,message:constants.USER_STATUS.NO_DATA})
     }
 })
module.exports = router;
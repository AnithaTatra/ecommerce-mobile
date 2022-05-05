const { use } = require('bcrypt/promises');
const jwt = require('jsonwebtoken');
const userSchema = require('../model/user.model');
const constants = require('../constants/constants.status');


function authVerify (req,res,next){
    try {
        let token = req.header("token")
        if(!token){
            return res.status(401).json({status:constants.USER_STATUS.FAILURE_STATUS, message:constants.USER_STATUS.AUTHORIZATION_STATUS})
        }
        const decode = jwt.verify(token, process.env.secretKey)
        console.log(decode)
        next();
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({status:constants.USER_STATUS.FAILURE_STATUS, message:constants.USER_STATUS.TOKEN_STATUS})
    }    
}

function isAdmin(req,res,next){
    try{
        console.log("verify token1");
        let token = req.header("token")
        if(!token){
            return res.status(401).json({status:constants.USER_STATUS.FAILURE_STATUS, message:constants.USER_STATUS.AUTHORIZATION_STATUS})
        }
        const decode = jwt.verify(token, process.env.secretKey)
        
        if(decode.role === "admin"){
            console.log(" Admin verified")
            next();
        }else{
            return res.status(401).json({status:constants.USER_STATUS.FAILURE_STATUS, message:constants.USER_STATUS.AUTHORIZATION_STATUS})
        }       
    }catch(error){
        console.log(error.message)
        return res.status(500).json({status:constants.USER_STATUS.FAILURE_STATUS, message:constants.USER_STATUS.TOKEN_STATUS})
    }
}

module.exports = {
     authVerify, isAdmin
}
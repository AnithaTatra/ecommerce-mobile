'use strict';

const mongoose = require("mongoose")
const crypto = require('crypto')

//userSchema creation
const userSchema = new mongoose.Schema({
  uuid : {type:String,required:false},  
  username : {type:String,required:true,trim:true},
  email : {type:String,required:true},
  password : {type:String,required:true},
  firstLoginStatus : {type:Boolean,required:false,default:false},
  lastVisited : {type:String,required:false},
  loginStatus : {type:Boolean,required:false,default:false}
  
},
{
    timestamps : true   
});

//uuid generation code
userSchema.pre('save',function(next){
     try{
       this.uuid = 'USER-'+crypto.pseudoRandomBytes(5).toString('hex');    
           next();
       }catch(error){
       console.log(error.message)
        }    
});

//user collection creation for userSchema
module.exports = mongoose.model('User',userSchema,'User');
'use strict';

const mongoose = require("mongoose")
const crypto = require("crypto");

//creating product schema
const productSchema = new mongoose.Schema({
    uuid : {type:String,required:false},
    productName : {type:String,required:true},
    description : {type:String,required:true},
    price : {type:String,required:true},
    specification : {type:String,required:true},
    activeStatus : {type:Boolean,required:false,default:false},
    userUuid: {type: String, required: true},
    categoryUuid:{type: String, required: true}

},
{
    timestamps :true
});

//uuid generation code
productSchema.pre('save',function(next){
    try{
      this.uuid = 'PROD-'+crypto.pseudoRandomBytes(6).toString('hex');    
          next();
      }catch(error){
      console.log(error.message)
       }    
});

//product collection creation for productSchema
module.exports = mongoose.model('Product',productSchema,'Product');

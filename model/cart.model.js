'use strict';

const mongoose = require("mongoose")
const crypto = require("crypto")

const cartSchema = new mongoose.Schema({
   userUuid :{ type:String,required:true},
   cartItems:[
       {
           product :{ type:mongoose.Schema.Types.ObjectId,ref:'Product',required:true},
           quantity :{ type:Number, default:1},
           price :{ type:Number,required:true},
           totalCost :{ type:Number,required:false}
       }
   ]
},
{
    timestamps:true
})
module.exports = mongoose.model('Cart',cartSchema,'Cart');

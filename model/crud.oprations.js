//const router = require("express").Router()
const bcrypt = require("bcrypt");
const userSchema = require("./user.model");
const productSchema = require("./product.model")
const jwt = require("jsonwebtoken")
const moment = require("moment")
var constants = require('../constants/constants.status');

//User Signup
 async function signupSave(req,res) {
  let user_Details = new userSchema(req.body)
  let password = req.body.password;
  let salt = await bcrypt.genSalt(10);
  user_Details.password = bcrypt.hashSync(password, salt);
  let result = await user_Details.save();
  return result;
} 

//User Login
async function loginPage(req,res) {
  let username = req.body.username
  let password = req.body.password
  let user_Data;
  let user_Details = await userSchema.findOne({username:username}).select('-id').exec()
  if(username){
    user_Data = await userSchema.findOne({username:username}).exec()
      if(!user_Data){
        return res.status(400).json({status:constants.USER_STATUS.FAILURE_STATUS, message:constants.USER_STATUS.PLEASE_SIGNUP})
      }
    }else{
        return res.status(400).json({status:constants.USER_STATUS.FAILURE_STATUS, message:constants.USER_STATUS.CORRECT_USERNAME})
    }
   if(user_Data){
     let isMatch = await bcrypt.compare(password, user_Data.password)
     if((user_Data).firstLoginStatus!==true){
       await userSchema.findOneAndUpdate({uuid:user_Data.uuid},{firstLoginStatus:true},{new:true}).exec()
     }
     let payload = {uuid:user_Data.uuid}
     if(isMatch){
       let user_Info = user_Details.toObject()
       let jwt_Token = jwt.sign(payload,process.env.secretKey)
       user_Info.jwt_Token = jwt_Token
       return res.status(200).json({status:constants.USER_STATUS.SUCCESS_STATUS,message:constants.USER_STATUS.LOGIN_SUCCESS,user_Info})
     }else{
       return res.status(400).json({status:constants.USER_STATUS.FAILURE_STATUS,message:constants.USER_STATUS.LOGIN_FAILED})
     }
   }   
}
//User Logout
async function logoutpage(req,res){
  let date = moment().toDate()
  await userSchema.findOneAndUpdate({uuid:req.params.uuid},{lastVisited:date,loginStatus:false},{new:true}).exec()
   return res.status(200).json({status:constants.USER_STATUS.SUCCESS_STATUS,message:constants.USER_STATUS.LOGOUT_SUCCESS})
}

//add productitems
async function addItem(req,res){
  const productData = req.body
  const productDetails = new productSchema(productData)
  const items = await productDetails.save();
  if(items){
      if(items.activeStatus!==true){
      await productSchema.findOneAndUpdate({uuid:items.uuid},{activeStatus:true},{new:true}).exec()
  }
 }
 return res.status(200).json({status:constants.USER_STATUS.SUCCESS_STATUS, message:constants.USER_STATUS.PRODUCT_STATUS,Result:items})
}

//get allproducts
async function getAllItems(req,res){
  let allProductsData = await productSchema.find().exec()
  if(allProductsData.length>0){
    return res.status(200).json({status:constants.USER_STATUS.SUCCESS_STATUS,message:constants.USER_STATUS.ALL_PRODUCT_STATUS,Result:allProductsData})
  }
} 

//get single product
async function getSingleItem(req,res){
  let oneItem = await productSchema.findOne({productName:req.body.productName}).exec()
  if(oneItem){
    return res.status(200).json({status:constants.USER_STATUS.SUCCESS_STATUS,message:constants.USER_STATUS.SINGLE_ITEM_STATUS,Result:oneItem})
  }
}

//update product
async function updateItems(req,res){
  let updateItem = await productSchema.findOneAndUpdate({uuid:req.body.uuid},req.body,{new:true}).exec()
  if(updateItem){
    return res.status(200).json({status:constants.USER_STATUS.SUCCESS_STATUS,message:constants.USER_STATUS.UPDATE_STATUS})
  }
}

//delete a product
async function deleteProduct(req,res){
  await productSchema.findOneAndDelete({uuid:req.query.uuid}).exec()
  return res.status(200).json({status:constants.USER_STATUS.SUCCESS_STATUS,message:constants.USER_STATUS.DELETE_STATUS})
}
//searchItem By ProductName
async function searchItem(req,res){
   let data=await productSchema.find({

            "$or":[
                {productName:{$regex:req.params.key}}
            ]
          
   })
   res.status(200).json({status:constants.USER_STATUS.SUCCESS_STATUS,message:constants.USER_STATUS.ALL_PRODUCT_STATUS,Result:data})
}
//priceFilter
async function priceFilter(req,res){
  let min=req.query.min;
  console.log("min..",min)
  let max=req.query.max;
  console.log("max..",max)
  let price_filter=await productSchema.aggregate([

    
      {
        $match:{
         $and:[
           {
             price:{
               $gte:min,
               $lte:max,
             },
            },
         ],
           },
         
        },
      {
        $sort:{price:1}
      },
      {
        $project:{
          "_id":0,
          "description":0,
          "uuid":0,
          "_v":0,
        }
      }

  ])
  res.status(200).json({status:constants.USER_STATUS.SUCCESS_STATUS,message:constants.USER_STATUS.FILTER_STATUS,Result:price_filter})

          
  
}
module.exports = {
  signupSave,loginPage,logoutpage,addItem,getAllItems,getSingleItem,updateItems,deleteProduct,searchItem,priceFilter
};

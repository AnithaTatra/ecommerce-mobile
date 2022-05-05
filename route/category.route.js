'use strict';

const router = require("express").Router()
const constants = require('../constants/constants.status');
const categorySchema=require("../model/category.model")
router.post('/addCategory', async(req,res)=>{
    try{
        const data = new categorySchema(req.body);
        const result = await data.save()
   
    return res.status(200).json({status: constants.USER_STATUS.SUCCESS_STATUS, message: constants.USER_STATUS.CATEGORY_ADDED_STATUS, result: result})
    }catch(error){
        console.log(error.message);
        return res.status(400).json({status: constants.USER_STATUS.FILTER_STATUS, message: error.message})
    }
})
// aggregate based
router.get("/userBasedProduct", async(req,res)=>{
    try {
        let productDetails = await categorySchema.aggregate([
           
           
             {
                 "$lookup":{
                     from: 'User',
                     localField: 'userUuid',
                     foreignField: 'uuid',
                     as:'user_data'
                 }
            },
            {
                "$lookup":{
                 from: 'category',
                 localField: ' uuid',
                 foreignField: 'categoryUuid',
                 as:'category_data'
             }
         },
            {
                '$lookup':{
                    from:'Product',
                    localField: 'uuid',
                    foreignField: 'categoryUuid', 
                    as: 'product_data'
                }
            },
    
 
            
           
            {
                $project: {
                    "_id": 0,
                    "product_data.productName": 1,
                    "product_data.description": 1,
                    "product_data.price": 1,
                    "product_data.specification": 1,
                    "product_data.activeStatus": 1,
                    "user_data.username":1,
                    "category_data.categoryName":1,
                    "category_data.categoryDesc":1


               }
            },  
        ])
        if(productDetails.length > 0){
            return res.status(200).json({'status': 'success', message: "Product details fetched successfully", 'result': productDetails});
        }else{
            return res.status(404).json({'status': 'failure', message: "No Product details available"})
        }
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
});
module.exports = router;
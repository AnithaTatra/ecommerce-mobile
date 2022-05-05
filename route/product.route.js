'use strict';

const router = require("express").Router()
//const productSchema = require('../model/product.model')
const curdoprations = require('../model/crud.oprations')
const constants = require('../constants/constants.status');


router.post('/addProduct', async(req,res)=>{
    try{
       curdoprations.addItem(req,res)       
    }catch(error){
        res.status(400).json({status:constants.USER_STATUS.FAILURE_STATUS, message:constants.USER_STATUS.NO_DATA}) 
    }
});

router.get('/getAllProducts',async(req,res)=>{
    try{
        curdoprations.getAllItems(req,res)
    }catch(error){
         res.status(400).json({status:constants.USER_STATUS.FAILURE_STATUS,message:constants.USER_STATUS.NO_DATA})
    }
});

router.get('/getSingleItem',async(req,res)=>{
    try{
        curdoprations.getSingleItem(req,res)
    }catch(error){
        res.status(400).json({status:constants.USER_STATUS.FAILURE_STATUS,message:constants.USER_STATUS.NO_DATA})
    }
});

router.put('/updateProduct',async(req,res)=>{
    try{
        curdoprations.updateItems(req,res)
    }catch(error){
        res.status(400).json({status:constants.USER_STATUS.FAILURE_STATUS,message:constants.USER_STATUS.NO_DATA})
    }
});

router.delete('/deleteProduct',async(req,res)=>{
    try{
        curdoprations.deleteProduct(req,res)
        
    }catch(error){
        res.status(400).json({status:constants.USER_STATUS.FAILURE_STATUS,message:constants.USER_STATUS.NO_DATA})
    }
})

router.get('/searchItem/:key',async(req,res)=>{
try{
    curdoprations.searchItem(req,res)
}catch(error){
    res.status(400).json({status:constants.USER_STATUS.FAILURE_STATUS,message:constants.USER_STATUS.NO_DATA})
}
});

router.get('/filterItemsPrice',async(req,res)=>{
try{
    curdoprations.priceFilter(req,res)
}catch(error){
    res.status(400).json({status:constants.USER_STATUS.FAILURE_STATUS,message:constants.USER_STATUS.NO_DATA})

}
})
module.exports = router;
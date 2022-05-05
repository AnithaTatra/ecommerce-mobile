'use strict';

const express = require("express")
const Cart = require("../model/cart.model")
const router = require("express").Router()
const user_id=require("../model/user.model")
const constants = require('../constants/constants.status');


router.post('/addItemToCart',async(req,res)=>{
    try{
     Cart.findOne({userUuid:req.query.userUuid})
           .exec((error,cart)=>{
               if(error) return res.status(400).json({error});
               if(cart){
                   const products=req.body.cartItems.product;
                    const alreadyExists=cart.cartItems.find(c=>c.product==products);
                    if(alreadyExists){
                        // "user":req.user._id
                        //62716995856f3d84119ca379
                        Cart.findOneAndUpdate({userUuid:req.query.userUuid,"cartItems.product":products},{

                            "$set":{
                            "cartItems":{
                                ...req.body.cartItems,
                                quantity:alreadyExists.quantity+req.body.cartItems.quantity,
                                totalCost:alreadyExists.price+=req.body.cartItems.price 
                                
                               }
                            }
                         
                        })
                        .exec((error,_cart)=>{
                            if(error) return res.status(400).json({error});
                            if(_cart){
                                return res.status(200).json({cart:_cart});
                            }
                       });
                    
                    }else{
                        Cart.findOneAndUpdate({userUuid:req.query.userUuid},{

                            "$push":{
                            "cartItems":req.body.cartItems
                            }
                        })
                        .exec((error,_cart)=>{
                            if(error) return res.status(400).json({error});
                            if(_cart){
                                return res.status(201).json({cart:_cart});
                            }
                       });
                    }
                

               }else{
                 const cart=new Cart({
                    userUuid:req.query.userUuid,
                     cartItems:[req.body.cartItems] 
        
                 });
                 cart.save((error,cart)=>{
                   if(error) return res.status(400).json({error});
                   if(cart){
                       return res.status(200).json({cart});
                   }
                 });
             }
            });
       
    }catch(error){
        return res.status(400).json({status:constants.USER_STATUS.FAILURE_STATUS,message:constants.USER_STATUS.NO_DATA})
    }
});

//get all items from cart
router.get('/allItemsInCart',async(req,res)=>{
    try{
        let cartItems = await Cart.find().exec()
        if(cartItems.length>0){
            return res.status(200).json({status:constants.USER_STATUS.SUCCESS_STATUS,message:constants.USER_STATUS.CART_ITEMS_STATUS,Items:cartItems})
        }
    }catch(error){
        return res.status(400).json({status:constants.USER_STATUS.FAILURE_STATUS,message:constants.USER_STATUS.NO_DATA})
    }
})

//delete a item from cart
router.delete('/deleteItemFromCart',async(req,res)=>{
    try{
        await Cart.findOneAndDelete({userUuid:req.query.userUuid}).exec()
        return res.status(200).json({status:constants.USER_STATUS.SUCCESS_STATUS,message:constants.USER_STATUS.DELETE_STATUS})
    }catch(error){
        return res.status(400).json({status:constants.USER_STATUS.FAILURE_STATUS,message:constants.USER_STATUS.NO_DATA})
    }
});



module.exports = router
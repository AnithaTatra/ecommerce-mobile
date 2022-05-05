'use strict';

const joi  = require('joi')

const DataValidation = joi.object({
    username : joi.string().alphanum().pattern(new RegExp('.*[0-9].*')).required(),
    email : joi.string().required(),
    password : joi.string().required()
    
})

module.exports={
    DataValidation
}
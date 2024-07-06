const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
    userId : {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    otp:{
        type:Number,
        required:true
    },
    timestamp:{
        type:Date,
        default: Data.now,
        required:true,
        get: (timestamp) => timestamp.getTime(),
        set: (timestamp) => new Date(timestamp) 
    }
})
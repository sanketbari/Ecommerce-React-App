const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: [true,"Please enter product name"]  //if not true then "Please enter product name"
    },
    description:{
        type: String,
        required: [true,"Please enter description name"]  //if not true then "Please enter product name"
    },
    price:{
        type: Number,
        required: [true,"Please enter product price"],  //if not true then "Please enter product name"
        maxLength : [8,"Please enter less than or equal to 8 digits"]
    },
    ratings:{
        type:Number,
        default: 0
    },
    images:[
        {
            public_id:{
                type: String,
                required: true
            },
            url:{
                type: String,
                required: true
            }
        }
    ],
    category:{
        type: String,
        required: [true,"Please enter product category"],  //if not true then "Please enter product name"
    },
    stock:{
        type: Number,
        required: [true,"Please enter product stock"],  //if not true then "Please enter product name"
        maxLength: [4,"stock cannot exceed 4 digits"],
        default: 1
    },
    numOfReviews:{
        type: Number,
        default:0
    },
    reviews: [
        {
            user:{
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true
            },
            name:{
                type: String,
                required: true
            },
            rating:{
                type: Number,
                required: true
            },
            comment:{
                type:String,
                required: true
            }
        }
    ],

    user:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }

})


module.exports = mongoose.model("product",productSchema);
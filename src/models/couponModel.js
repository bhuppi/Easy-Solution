const mongoose = require("mongoose");
let objectId = mongoose.Types.ObjectId
const couponSchema = new mongoose.Schema(
  {
    couponName:String,
    couponCode:{type:String,unique:true},
    couponPercent:Number,
    categoryId:[{type:objectId,ref:"categoryModel",default:null}],
    icon:String,
    minOrderPrice:Number,
    maxDiscountPrice:Number,
    couponQuantity:Number, 
    expiryDate:Date,
    startDate:Date,
    validity:Number,
    backgroundColourCode: String,
    taskColourCode: String,
    disable:{
      type:Boolean,default:false
     }
  },
  { timestamps: true }
);

module.exports = mongoose.model("couponSchema", couponSchema);
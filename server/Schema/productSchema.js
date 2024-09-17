const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    cost_price:{
      type:Number,
      required:true
    },
    selling_price:{
      type:Number,
      required:true
    },
    sale:{
      type:Number,
      required:true
    },
    monthly_sale:{
      type:Number,
      required:true
    },
    stock_cost:{
      type:Number,
      required:true
    },
    stock_selling_price:{
      type:Number,
      required:true
    },
    stock_profit:{
      type:Number,
      required:true
    },
    manufacture_date: {
      type: Date,
      required: true,
    },
    expiry_date: {
      type: Date,
      required: true,
    },
    batch_number: {
      type: Number,
    },
    barcode_text: {
      type: String,
    },
    barcode: {
      type: Buffer,
    },
  });
  
  const product = mongoose.model("Inventory_Product", productSchema);

  module.exports=product
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
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
      required: true,
    },
    barcode: {
      type: Buffer,
      required: true,
    },
  });
  
  const product = mongoose.model("Inventory_Product", productSchema);

  module.exports=product
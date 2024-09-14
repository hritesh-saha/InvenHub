const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
    customerName: String,
    amount: Number,
    date: {
      type: Date,
      default: Date.now,
    },
    items: [
      {
        itemName: String,
        quantity: Number,
        price: Number,
      },
    ],
    paymentMethod: String,
  });
  
  const bill = mongoose.model("BillDetails", billSchema);

  module.exports=bill
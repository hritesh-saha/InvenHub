const mongoose = require("mongoose");

const signupSchema = new mongoose.Schema({
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone:{
      type:Number,
      required:true
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
    },
    otpExpiration: {
      type: Date,
    },
  });
  
  const signUp = mongoose.model("SignUp_Data", signupSchema);

  module.exports=signUp
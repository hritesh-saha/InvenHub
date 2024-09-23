const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
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
    location:{
        type:String,
        default:null,
    }
  });

  const profile = mongoose.model("Profile_Data", profileSchema);

  module.exports=profile
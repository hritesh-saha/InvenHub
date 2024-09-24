const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const db_url = process.env.DB_URI;
mongoose.connect(db_url);
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bwipjs = require("bwip-js");
const axios = require('axios');
const app = express();
const port = process.env.SERVER_PORT;
const signUp=require("./Schema/signupSchema");
const bill=require("./Schema/billSchema");
const product=require("./Schema/productSchema");
const profile=require("./Schema/profileSchema");
app.use(bodyParser.json());
app.use(
  cors({
    origin: true,
    methods: ["GET","POST","PUT","DELETE"],
    allowedHeaders: "*",
    credentials: true,
  })
);
const db = mongoose.connection;


db.once("open", async() => {
  await product.collection.dropIndexes();

  console.log("Mongodb Connection Successful");
});


app.get("/", (req, res) => {
  res.send("Welcome to the home page");
});

app.get("/bill", async (req, res) => {
  const billDetails = await bill.find();
  res.json(billDetails);
});

app.post("/bill", async (req, res) => {
  try {
    const billDetails = new bill({
      customerName: req.body.customerName,
      amount: req.body.amount,
      items: req.body.items,
      paymentMethod: req.body.paymentMethod,
    });
    await billDetails.save();
    console.log("bill registered", billDetails);
  } catch (err) {
    console.error("Error saving bill:", err.message);
    res.status(500).send("Not Happening");
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { firstname, lastname, email, phone, password } = req.body;

    const user = await signUp.findOne({ email });
    if (user) {
      return res.status(400).send({ message: "Email already exists" });
    }

    const otp = crypto.randomInt(100000, 999999);
    const otpExpiration = Date.now() + 10 * 60 * 1000;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: process.env.USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const owner = new signUp({
      firstname,
      lastname,
      email,
      phone,
      password: hashedPassword,
      otp,
      otpExpiration,
    });

    await owner.save();
    console.log("User Registered, awaiting OTP verification:", owner);

    res
      .status(200)
      .send({
        message:
          "OTP sent to your email. Please verify to complete registration.",
      });
  } catch (err) {
    console.error("Error saving user:", err.message);
    res.status(500).send("Internal server error");
  }
});


app.post("/verify-otp", async (req, res) => {
  try {
    const { otp } = req.body;

    // Find a user with the provided OTP
    const user = await signUp.findOne({
      otp: parseInt(otp),
      otpExpiration: { $gte: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .send({ message: "Invalid OTP or OTP has expired" });
    }

    // Clear OTP and expiration date
    user.otp = null;
    user.otpExpiration = null;
    await user.save();

    res.status(200).send({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error verifying OTP:", err.message);
    res.status(500).send("Internal server error");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await signUp.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "Invalid email or password" });
    }
    //const passwordCompare = await bcrypt.compare(password, user.password);
    //if (!passwordCompare) {
    //  return res.status(400).send({ message: "Invalid email or password" });
    //}
     else {
      console.log("User Logged In:", email);
      return res.status(200).send({ message: "Login Successfull" });
    }
  } catch (err) {
    console.error("Error logging in:", err.message);
    res.status(500).send("Internal server error");
  }
});

app.post("/add-product", async (req, res) => {
  try {
    const { name,email,cost_price,selling_price,sale,monthly_sale, manufacture_date, expiry_date, batch_number, barcode_text } =req.body;

    const stock_cost=cost_price*sale;
    const stock_selling_price=selling_price*sale;
    const stock_profit=stock_selling_price-stock_cost;

    // Function to calculate the check digit for EAN-13
    const calculateCheckDigit = (barcode) => {
      let sumOdd = 0;
      let sumEven = 0;

      for (let i = 0; i < 12; i++) {
        const digit = parseInt(barcode[i]);
        if (i % 2 === 0) {
          sumOdd += digit;
        } else {
          sumEven += digit;
        }
      }

      const total = sumOdd + sumEven * 3;
      const checkDigit = (10 - (total % 10)) % 10;

      return checkDigit.toString();
    };

    // Function to generate a valid 12-digit barcode and append the check digit
    const generateEAN13Barcode = async () => {
      let uniqueBarcode;

      do {
        const randomBarcode = Math.floor(Math.random() * 1000000000000)
          .toString()
          .padStart(12, "0");
        const checkDigit = calculateCheckDigit(randomBarcode);
        const fullBarcode = randomBarcode + checkDigit;

        const existingBarcode = await product.findOne({
          barcode_text: fullBarcode,
        });

        if (!existingBarcode) {
          uniqueBarcode = fullBarcode;
        }
      } while (!uniqueBarcode);

      return uniqueBarcode;
    };

    // Use the provided barcode_text or generate one if not provided
    let finalBarcodeText = barcode_text || (await generateEAN13Barcode());

    // Validate the barcode (if provided by the user)
    if (barcode_text) {
      const checkDigit = calculateCheckDigit(barcode_text.slice(0, 12));
      if (barcode_text.slice(12) !== checkDigit) {
        return res.status(400).send("Invalid EAN-13 barcode.");
      }
    }

    // Generate the barcode image
    const barcodeImage = await bwipjs.toBuffer({
      bcid: "ean13", 
      text: finalBarcodeText, 
      scale: 3,
      height: 10, 
      includetext: true, 
      textxalign: "center", 
    });

    // Create a new product with the generated barcode
    const newProduct = new product({
      name,
      email,
      cost_price,
      selling_price,
      sale,
      monthly_sale,
      stock_cost,
      stock_selling_price,
      stock_profit,
      manufacture_date,
      expiry_date,
      batch_number,
      barcode_text: finalBarcodeText,
      barcode: barcodeImage,
    });

    await newProduct.save();

    console.log("Product added with EAN-13 Barcode:", finalBarcodeText);
    res.status(200).send("Product successfully added.");
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error
      return res.status(400).send("A product with this name and email combination already exists.");
    }
    console.error("Error adding product:", err.message);
    res.status(500).send("An error occurred while adding the product.");
  }
});

app.get("/product",async(req,res)=>{
  try{
    const {email}=req.body;
    if(!email){
      return res.status(400).send("Email is required");
    };
    const item=await product.find({email});
    res.json(item);
  }
  catch{
    res.status(500).send("An error occurred while fetching products.");
  }
});


app.put("/update-product", async (req, res) => {
  try {
    const { name,email,cost_price,selling_price,sale,monthly_sale, manufacture_date, expiry_date, batch_number, barcode_text } =req.body;

    const user = await product.findOne({ name,email });
    if (!user) {
      return res.status(400).json({ message: "Product Not Found!" });
    }

    const updates = {};
    if (cost_price != null) updates.cost_price = cost_price;
    if (selling_price != null) updates.selling_price = selling_price;
    if (sale != null) updates.sale = sale;
    if (monthly_sale != null) updates.monthly_sale = monthly_sale;
    if (manufacture_date != null) updates.manufacture_date = manufacture_date;
    if (expiry_date != null) updates.expiry_date = expiry_date;
    if (batch_number != null) updates.batch_number = batch_number;
    if (barcode_text != null) updates.barcode_text = barcode_text;

    const updatedProduct = await product.findOneAndUpdate(
      { name,email }, // Search Condition
      { $set: updates }, // Update only valid fields
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product Not Found!" });
    }

    return res
      .status(200)
      .json({ message: "product updated successfully!", updatedProduct });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to update product information" });
  }
});

app.delete("/delete-product",async(req,res)=>{
  try{
    const {name,email}=req.body;
    if(!name){
      return res.status(400).json({message:"Product name is required!"});
    };
    const deletedProduct=await product.findOneAndDelete({name,email});
    if(!deletedProduct){
      return res.status(404).json({message:"Product Not Found!"});
    }
    return res.status(200).json({message:"Product deleted successfully!"});
  }
  catch{
    res.status(500).send("An error occurred while deleting products.");
  }
})

app.get('/search', async (req, res) => {
  try {
    const { query,email } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    const results = await product.find({ name: new RegExp('^' + query, 'i'),email });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.post("/predict",async(req,res)=>{
  try{
    const {date,category}=req.body;
    const parsedDate = new Date(date);
    const month = `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}`;

    const requestedData={
      category,
      month
    };
    console.log(requestedData);
    const response=await axios.post('http://localhost:5500/predict',requestedData);
    console.log(response);
    res.json(response.data);
  }
  catch{
    res.status(500).json({ message: 'Server error'});
  }
});

app.get("/profile",async(req,res)=>{
  try{
    const {email}=req.body;
    const user=await profile.find({email});
    res.status(200).json(user);
  }
  catch{
    res.status(500).json({ message: 'Error fetching Profile'});
  }
});

app.post("/add-profile",async(req,res)=>{
  try{
    const {firstname,lastname,email,phone,location}=req.body;
    const user=await profile.find({email});
    if(!user){
      return res.status(404).json({message:"Profile Not Found"});
    }
    const newUser=await profile.create({
      firstname,
      lastname,
      email,
      phone,
      location});
      await newUser.save();
      return res.status(201).json({message:"Profile saved Successfully"});
  }
  catch{
    res.status(500).json({ message: 'Error fetching Profile'});
  }
});

app.put("/update-profile",async(req,res)=>{
  try{
    const {firstname,lastname,email,phone,location}=req.body;
    const user=await profile.find({email});
    if(!user){
      return res.status(404).json({message:"Profile Not Found"});
    };
    const updates={};
    if(firstname) updates.firstname=firstname;
    if(lastname) updates.lastname=lastname;
    if(phone) updates.phone=phone;
    if(location) updates.location=location;
    const updatedUser=await profile.findOneAndUpdate(
      {email}, // Search Condition
      { $set: updates }, // Update only valid fields
      { new: true, runValidators: true } // Return the updated document)
);
if(!updatedUser){
  return res.status(404).json({message:"Unable to Update Profile"});
}
res.status(200).json(updatedUser);
}
  catch{
    res.status(500).json({ message: 'Error fetching Profile'});
  }
})

app.listen(port, () => {
  console.log("Server is running on port");
});

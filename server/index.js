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
const app = express();
const port = process.env.SERVER_PORT;
const signUp=require("./Schema/signupSchema");
const bill=require("./Schema/billSchema");
const product=require("./Schema/productSchema");
app.use(bodyParser.json());
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST"],
    allowedHeaders: "*",
    credentials: true,
  })
);
const db = mongoose.connection;
db.once("open", () => {
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

    //if (password !== confirmPassword) {
    //    return res.status(400).send({ message: "Passwords are not matching" });
    //}

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
    const { name,cost_price,selling_price,sale,monthly_sale, manufacture_date, expiry_date, batch_number, barcode_text } =req.body;

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
    console.error("Error adding product:", err.message);
    res.status(500).send("An error occurred while adding the product.");
  }
});

app.get("/product",async(req,res)=>{
    const item=await product.find();
    res.json(item);
});


app.put("/update-product", async (req, res) => {
  try {
    const { name,cost_price,selling_price,sale,monthly_sale, manufacture_date, expiry_date, batch_number, barcode_text } =req.body;

    const user = await product.findOne({ name });
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
      { name }, // Search Condition
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


app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

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

const signupSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  country: {
    type: String,
  },
  referral: {
    type: String,
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
    const { username, email, country, referral, password } = req.body;

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
      username,
      email,
      country,
      referral,
      otp,
      otpExpiration,
      password: hashedPassword,
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

//app.post("/verify-otp", async (req, res) => {
//  try {
//      const { email, otp } = req.body;
//
//        const user = await signUp.findOne({ email });
//        if (!user) {
//            return res.status(400).send({ message: "User not found" });
//        }
//
//        if (user.otp !== parseInt(otp)) {
//            return res.status(400).send({ message: "Invalid OTP" });
//        }
//
//        if (Date.now() > user.otpExpiration) {
//            return res.status(400).send({ message: "OTP has expired" });
//        }

//        user.otp = null;
//        user.otpExpiration = null;
//        await user.save();

//        res.status(200).send({ message: "User registered successfully" });

//    } catch (err) {
//        console.error('Error verifying OTP:', err.message);
//        res.status(500).send("Internal server error");
//    }
//});

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
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).send({ message: "Invalid email or password" });
    } else {
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
    const { name, manufacture_date, expiry_date, batch_number, barcode_text } =req.body;

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

app.get("/add-product",async(req,res)=>{
    const item=await product.find();
    res.json(item);
});

//app.get("/get-product", async (req, res) => {
//  try {
//      const { barcode_text } = req.query; // Assuming you're using a query parameter to get the product by barcode_text
//      const item = await product.findOne({ barcode_text });
//
//      if (!item) {
//          return res.status(404).json({ message: "Product not found" });
//      }
//
//      res.json(item);
//  } catch (error) {
//      res.status(500).json({ message: "Error fetching product", error: error.message });
//  }
//});


app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

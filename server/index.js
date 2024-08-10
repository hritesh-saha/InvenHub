const dotenv=require('dotenv');
dotenv.config();
const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const bcrypt=require("bcryptjs")
const db_url=process.env.DB_URI;
mongoose.connect(db_url);
const bodyParser = require('body-parser');
const nodemailer=require("nodemailer");
const crypto = require('crypto');
const app=express();
const port=process.env.SERVER_PORT;
app.use(bodyParser.json());
app.use(cors({
    origin:true,
    methods:["GET","POST"],
    allowedHeaders: '*',
    credentials:true
}));
const db=mongoose.connection
db.once('open',()=>{
    console.log("Mongodb Connection Successful");
});

const signupSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    country:{
        type:String,
    },
    referral:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    otp:{
        type:Number,
        },
     otpExpiration:{
        type:Date,
     }
});

const signUp=mongoose.model("SignUp_Data",signupSchema);

const billSchema=new mongoose.Schema({
    customerName: String,
    amount: Number,
    date:{
        type:Date,
        default:Date.now
    },
    items:[{
        itemName: String,
        quantity: Number,
        price: Number
    }],
    paymentMethod: String
});

const bill=mongoose.model("BillDetails",billSchema)

app.get("/",(req,res)=>{
    res.send("Welcome to the home page");
})

app.get("/bill",async(req,res)=>{
    const billDetails=await bill.find();
    res.json(billDetails)
})

app.post("/bill",async(req,res)=>{
    try{
        const billDetails=new bill({
            customerName:req.body.customerName,
            amount:req.body.amount,
            items:req.body.items,
            paymentMethod:req.body.paymentMethod
        })
        await billDetails.save();
        console.log("bill registered",billDetails)
    }
    catch(err){
        console.error('Error saving bill:', err.message);
        res.status(500).send('Not Happening');
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
            service: 'Gmail',
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        });

        const mailOptions = {
            from: process.env.USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}. It is valid for 10 minutes.`
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
            password: hashedPassword
        });

        await owner.save();
        console.log("User Registered, awaiting OTP verification:", owner);

        res.status(200).send({ message: "OTP sent to your email. Please verify to complete registration." });

    } catch (err) {
        console.error('Error saving user:', err.message);
        res.status(500).send("Internal server error");
    }
});


app.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await signUp.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: "User not found" });
        }

        if (user.otp !== parseInt(otp)) {
            return res.status(400).send({ message: "Invalid OTP" });
        }

        if (Date.now() > user.otpExpiration) {
            return res.status(400).send({ message: "OTP has expired" });
        }

        user.otp = null;
        user.otpExpiration = null;
        await user.save();

        res.status(200).send({ message: "User registered successfully" });

    } catch (err) {
        console.error('Error verifying OTP:', err.message);
        res.status(500).send("Internal server error");
    }
});

app.post("/login",async(req,res)=>{
    try{
        const{email,password}=req.body;
        const user=await signUp.findOne({email});
        if(!user){
            return res.status(400).send({message:"Invalid email or password"})
        }
        const passwordCompare=await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            return res.status(400).send({message:"Invalid email or password"})
        }
        else{
            console.log("User Logged In:",email)
            return res.status(200).send({message:"Login Successfull"})
        }
    }
    catch(err){
        console.error('Error logging in:', err.message);
        res.status(500).send("Internal server error");
    }
});

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
});
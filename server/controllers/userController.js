import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import razorpay from "razorpay";
import transactionModel from "../models/transactionModel.js";

// Register User Function
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !name || !password) {
      return res.json({ success: false, message: "Missing details" });
    }

    const user = await userModel.findOne({ email });
    if (user) {
      return res.json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const createdUser = await newUser.save();

    const token = jwt.sign({ id: createdUser._id }, process.env.JWT_SECRET);

    res.json({ success: true, token, user: { name: createdUser.name } });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Login User Function
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token, user: { name: user.name } });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//user credits
const usercredits = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }
    res.json({
      success: true,
      credits: user.creditBalance,
      user: { name: user.name },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentRazorpay = async (req, res) => {
  try {
    const { userId, planId } = req.body;
    const userdata = await userModel.findById(userId);

    if (!userId || !planId) {
      return res.json({ success: false, message: "Missing details" });
    }

    let plan, amount, credits, date;

    switch (planId) {
      case "Basic":
        plan = "Basic"; 
        credits = 100;  
        amount = 10;    
        break;

      case "Advanced":
        plan = "Advanced"; 
        credits = 1500;     
        amount = 50;        
        break;

      case "Business":
        plan = "Business"; 
        credits = 5000;    
        amount = 250;      
        break;

      default:
        return res.json({ success: false, message: "plan not found" });

    }
    date=Date.now()

    const transactiondata={
      userId,plan,credits,amount,date
    }

    const newtransaction= await transactionModel.create(transactiondata)

    const options={
      amount:amount*100,
      currency:process.env.CURRENCY,
      receipt:newtransaction._id
    }

    await razorpayInstance.orders.create(options,(error,order)=>{
      if(error){
        console.log(error)
        return res.json({ success: false, message: error });
      }
      return res.json({ success: true, order });

    })



  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyrazorpay= async(req,res)=>{
  try {
    const {razorpay_order_id} = req.body

    const orderinfo= await razorpayInstance.orders.fetch(razorpay_order_id)

    if(orderinfo.status==='paid'){

      const transactiondata= await transactionModel.findById(orderinfo.receipt)
      
      if(transactiondata.payment===true){
        return res.json({ success: false, message: "payment failed" });
      }else{
        const userdata= await userModel.findById(transactiondata.userId)

        const creditBalance= transactiondata.credits + userdata.creditBalance

        await userModel.findByIdAndUpdate(userdata._id,{creditBalance})

        await transactionModel.findByIdAndUpdate(transactiondata._id,{payment:true})
        return res.json({success:true,message:"Payment successful, credits added "})
      }
    }else{
        return res.json({ success: false, message: "payment failed" });

    }


    
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
}

export { registerUser, loginUser, usercredits, paymentRazorpay,verifyrazorpay };

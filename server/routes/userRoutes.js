import { registerUser,loginUser, usercredits, paymentRazorpay,verifyrazorpay } from "../controllers/userController.js";
import express from 'express'
import userAuth from "../middlewares/auth.js";

const userRouter=express.Router()

userRouter.get("/test", (req, res) => {
    res.send("User Router is working!");
  });

  //localhost:4000/api/user/register
//localhost:4000/api/user/login
userRouter.post('/register',registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/credit',userAuth,usercredits)
userRouter.post('/pay-razor',userAuth,paymentRazorpay)
userRouter.post('/verify-razor',verifyrazorpay)


export default userRouter
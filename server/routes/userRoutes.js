import express from 'express';
import {
  registerUser,
  loginUser,
  userCredits,
  buyCredits,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from '../controllers/userControllers.js';
import userAuth from '../middlewares/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/credits', userAuth, userCredits);
userRouter.post('/buy-credits', userAuth, buyCredits);
userRouter.post('/create-razorpay-order', userAuth, createRazorpayOrder);
userRouter.post('/verify-razorpay-payment', userAuth, verifyRazorpayPayment);

export default userRouter;
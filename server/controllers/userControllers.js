import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import Razorpay from 'razorpay'
import userModel from '../models/userModels.js'

const getRazorpayClient = () => {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET_KEY;

  if (!keyId || !keySecret) {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

// registerUser controller funtion
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword
        };

        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret#text");

        res.json({
            success: true,
            token,
            user: { name: user.name }
        });

    } catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

// loginUser controller funtion
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret#text");

            res.json({
                success: true,
                token,
                user: { name: user.name }
            });

        } else {
            return res.json({ success: false, message: 'Invalid credentials' });
        }

    } catch (error) {
          console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// userCredits controller funtion
const userCredits = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId);

    res.json({
      success: true,
      credits: user.creditBalance,
      user: { name: user.name }
    });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

const buyCredits = async (req, res) => {
  try {
    const { userId, credits } = req.body;
    const creditAmount = Number(credits);

    if (!Number.isFinite(creditAmount) || creditAmount <= 0) {
      return res.json({ success: false, message: 'Invalid credit amount' });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $inc: { creditBalance: creditAmount } },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Credits added successfully',
      creditBalance: updatedUser.creditBalance,
      user: { name: updatedUser.name }
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

const createRazorpayOrder = async (req, res) => {
  try {
    const { userId, amount, credits } = req.body;
    const payableAmount = Number(amount);
    const creditAmount = Number(credits);

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET_KEY;

    if (!keyId || !keySecret) {
      return res.json({
        success: false,
        message: 'Razorpay keys are missing. Add RAZORPAY_KEY_ID and RAZORPAY_SECRET_KEY (or RAZORPAY_KEY_SECRET) in your environment.'
      });
    }

    const razorpay = getRazorpayClient();

    if (!razorpay) {
      return res.json({
        success: false,
        message: 'Razorpay client is not initialized. Please check your Razorpay configuration.'
      });
    }

    if (!Number.isFinite(payableAmount) || payableAmount <= 0) {
      return res.json({ success: false, message: 'Invalid payment amount' });
    }

    if (!Number.isFinite(creditAmount) || creditAmount <= 0) {
      return res.json({ success: false, message: 'Invalid credit count' });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(payableAmount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: String(userId),
        creditAmount: String(creditAmount)
      }
    });

    res.json({
      success: true,
      order,
      message: 'Razorpay order created'
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      userId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      credits
    } = req.body;

    const creditAmount = Number(credits);

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !Number.isFinite(creditAmount) || creditAmount <= 0) {
      return res.json({ success: false, message: 'Invalid payment response' });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET_KEY;

    if (!keySecret) {
      return res.json({ success: false, message: 'Razorpay secret key is missing in the environment.' });
    }

    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.json({ success: false, message: 'Payment verification failed' });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $inc: { creditBalance: creditAmount } },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Payment successful. Credits added.',
      creditBalance: updatedUser.creditBalance,
      user: { name: updatedUser.name }
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  userCredits,
  buyCredits,
  createRazorpayOrder,
  verifyRazorpayPayment,
};


const Razorpay = require("razorpay");
const JobCard = require("../models/JobCard");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "YOUR_KEY_ID",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "YOUR_KEY_SECRET",
});

// Create Razorpay Order
const createOrder = async (req, res) => {
  try {
    const { amount, jobId } = req.body;

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      ...order,
      jobId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Unable to create Razorpay order",
    });
  }
};

// Update Job after successful payment
const makePayment = async (req, res) => {
  try {
    const job = await JobCard.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job Not Found",
      });
    }

    job.paidAmount =
      Number(job.paidAmount) + Number(job.pendingAmount);

    job.pendingAmount = 0;
    job.status = "Paid";

    await job.save();

    res.json({
      success: true,
      message: "Payment Successful",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  makePayment,
};
const JobCard = require("../models/JobCard");

// Customer requests payment
const requestPayment = async (req, res) => {
  try {
    const job = await JobCard.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job Not Found",
      });
    }

    job.paymentStatus = "Waiting";
    job.paymentRequestedAt = new Date();

    await job.save();

    const io = req.app.get("io");
    io.emit("paymentRequested", job);

    res.json({
      success: true,
      message: "Payment request sent successfully.",
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Owner approves payment
const approvePayment = async (req, res) => {
  try {
    const job = await JobCard.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job Not Found",
      });
    }

    job.paidAmount =
      Number(job.paidAmount) +
      Number(job.pendingAmount);

    job.pendingAmount = 0;

    job.paymentStatus = "Paid";
    job.paymentVerifiedAt = new Date();

    await job.save();

    const io = req.app.get("io");
    io.emit("paymentApproved", job);

    res.json({
      success: true,
      message: "Payment Approved",
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Owner rejects payment
const rejectPayment = async (req, res) => {
  try {
    const job = await JobCard.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job Not Found",
      });
    }

    job.paymentStatus = "Rejected";

    await job.save();

    const io = req.app.get("io");
    io.emit("paymentRejected", job);

    res.json({
      success: true,
      message: "Payment Rejected",
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  requestPayment,
  approvePayment,
  rejectPayment,
};
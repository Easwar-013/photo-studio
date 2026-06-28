const mongoose = require("mongoose");

const JobCardSchema = new mongoose.Schema(
{
  jobId: {
    type: String,
    required: true,
    unique: true
  },

  customerName: {
    type: String,
    required: true
  },

  customerEmail: {
  type: String,
  required: true
  },

  workType: {
    type: String,
    required: true
  },

  assignedEditor: {
    type: String,
    default: ""
  },

  status: {
    type: String,
    enum: ["Available", "Accepted", "In Progress", "Completed"],
    default: "Available"
  },

  acceptedAt: {
    type: Date,
    default: null
  },

  completedAt: {
    type: Date,
    default: null
  },

  progress: {
    type: Number,
    default: 0
  },

  totalAmount: {
    type: Number,
    default: 0
  },

  paidAmount: {
    type: Number,
    default: 0
  },

  pendingAmount: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: [
      "Not Requested",
      "Waiting",
      "Paid",
      "Rejected"
    ],
    default: "Not Requested"
  },

  paymentRequestedAt: {
    type: Date,
    default: null,
  },

  paymentVerifiedAt: {
    type: Date,
    default: null
  },
  

  notes: {
    type: String,
    default: ""
  },

  deliveryDate: {
    type: Date
  }
},
{
  timestamps: true
});

module.exports = mongoose.model("JobCard", JobCardSchema);
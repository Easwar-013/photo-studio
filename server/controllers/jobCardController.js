const JobCard = require("../models/JobCard");

// GET ALL JOBS
const getJobCards = async (req, res) => {
  try {
    console.log("GET ALL JOBS");

    const jobs = await JobCard.find().sort({
      createdAt: -1,
    });

    console.log("Jobs Found:", jobs.length);

    res.status(200).json(jobs);
  } catch (error) {
    console.error("getJobCards Error:");
    console.error(error);
    console.error(error.stack);

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET STAFF JOBS
const getStaffJobs = async (req, res) => {

  try {

    const jobs = await JobCard.find({

      assignedEditor: req.params.staffId,

      status: {
        $ne: "Available"
      }

    });

    res.json(jobs);

  } catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

};

// GET AVAILABLE JOBS
const getAvailableJobs = async (req, res) => {
  try {

    const jobs = await JobCard.find({
      status: "Available"
    });

    res.json(jobs);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

// STAFF ACCEPT JOB
const acceptJob = async (req, res) => {

  try {

    const { staffId } = req.body;

    const job = await JobCard.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    if (job.status !== "Available") {
      return res.status(400).json({
        message: "Job already accepted"
      });
    }

    job.status = "Accepted";
    job.assignedEditor = staffId;
    job.acceptedAt = new Date();

    await job.save();

    const io = req.app.get("io");
    io.emit("jobAccepted", job);

    res.json(job);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

// COMPLETE JOB
const completeJob = async (req, res) => {

  try {

    const job = await JobCard.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    job.status = "Completed";
    job.progress = 100;
    job.completedAt = new Date();

    await job.save();

    const io = req.app.get("io");

    io.emit("jobCompleted", job);

    res.json(job);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

// GET CUSTOMER JOBS
const getCustomerJobs = async (req, res) => {
  try {
    console.log("CUSTOMER EMAIL:", req.params.email);

    const jobs = await JobCard.find({
      customerEmail: req.params.email,
    });

    console.log("Customer Jobs:", jobs.length);

    res.status(200).json(jobs);
  } catch (error) {
    console.error("getCustomerJobs Error:");
    console.error(error);
    console.error(error.stack);

    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE JOB
const createJobCard = async (req, res) => {
  try {
    const job = await JobCard.create(req.body);

    const io = req.app.get("io");
    io.emit("newJob", job);

    res.status(201).json(job);
  } catch (error) {
    console.error("createJobCard Error:");
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE FULL JOB
const updateJobCard = async (req, res) => {
  try {
    const job = await JobCard.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    const io = req.app.get("io");
    io.emit("jobUpdated", job);

    res.json(job);
  } catch (error) {
    console.error("updateJobCard Error:");
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// STAFF UPDATE PROGRESS
const updateProgress = async (req, res) => {
  try {
    const job = await JobCard.findByIdAndUpdate(
      req.params.id,
      {
        progress: req.body.progress,
        status: req.body.status,
        notes: req.body.notes,
      },
      {
        new: true,
      }
    );

    res.json(job);
  } catch (error) {
    console.error("updateProgress Error:");
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE JOB
const deleteJobCard = async (req, res) => {
  try {
    await JobCard.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Job Deleted",
    });
  } catch (error) {
    console.error("deleteJobCard Error:");
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getJobCards,
  getCustomerJobs,
  getStaffJobs,
  getAvailableJobs,
  acceptJob,
  completeJob,
  createJobCard,
  updateJobCard,
  updateProgress,
  deleteJobCard,
};
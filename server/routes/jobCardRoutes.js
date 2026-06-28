const express = require("express");
const router = express.Router();

const {
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
} = require("../controllers/jobCardController");

router.get("/", getJobCards);

router.get("/customer/:email", getCustomerJobs);

router.get(
  "/staff/:staffId",
  getStaffJobs
);

router.get("/available", getAvailableJobs);

router.put("/accept/:id", acceptJob);

router.put("/complete/:id", completeJob);

router.post("/", createJobCard);

router.put("/:id", updateJobCard);

router.put("/progress/:id", updateProgress);

router.delete("/:id", deleteJobCard);

module.exports = router;

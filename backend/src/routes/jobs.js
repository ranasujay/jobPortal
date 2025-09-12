const express = require('express');
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getJobs)
  .post(protect, authorize('recruiter'), createJob);

router.get('/my-jobs', protect, authorize('recruiter'), getMyJobs);

router.route('/:id')
  .get(getJob)
  .put(protect, authorize('recruiter'), updateJob)
  .delete(protect, authorize('recruiter'), deleteJob);

module.exports = router;
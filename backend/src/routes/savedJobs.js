const express = require('express');
const {
  getSavedJobs,
  saveJob,
  unsaveJob,
  checkJobSaved
} = require('../controllers/savedJobController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getSavedJobs);

router.route('/:jobId')
  .post(saveJob)
  .delete(unsaveJob);

router.route('/check/:jobId')
  .get(checkJobSaved);

module.exports = router;
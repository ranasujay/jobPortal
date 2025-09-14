const express = require('express');
const {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  getMyCompany,
  getMyCompanies,
  getCompanyJobs
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getCompanies)
  .post(protect, authorize('recruiter'), createCompany);

router.get('/my-company', protect, authorize('recruiter'), getMyCompany);
router.get('/my-companies', protect, authorize('recruiter'), getMyCompanies);

router.route('/:id')
  .get(getCompany)
  .put(protect, authorize('recruiter'), updateCompany)
  .delete(protect, authorize('recruiter'), deleteCompany);

router.get('/:id/jobs', getCompanyJobs);

module.exports = router;
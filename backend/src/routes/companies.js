const express = require('express');
const {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  getMyCompany
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getCompanies)
  .post(protect, authorize('recruiter'), createCompany);

router.get('/my-company', protect, authorize('recruiter'), getMyCompany);

router.route('/:id')
  .get(getCompany)
  .put(protect, authorize('recruiter'), updateCompany)
  .delete(protect, authorize('recruiter'), deleteCompany);

module.exports = router;
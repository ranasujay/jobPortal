const express = require('express');
const {
  applyToJob,
  getJobApplications,
  updateApplicationStatus,
  getMyApplications,
  withdrawApplication,
  getApplicationDocument,
  serveApplicationDocument,
  proxyApplicationDocument,
  debugApplicationDocument,
  uploadMiddleware
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Job seeker routes
router.post('/apply', protect, authorize('candidate'), uploadMiddleware, applyToJob);
router.get('/my-applications', protect, authorize('candidate'), getMyApplications);
router.patch('/:id/withdraw', protect, authorize('candidate'), withdrawApplication);

// Recruiter routes
router.get('/job/:jobId', protect, authorize('recruiter'), getJobApplications);
router.patch('/:id/status', protect, authorize('recruiter'), updateApplicationStatus);

// Shared routes (both recruiters and job seekers can access their relevant documents)
router.get('/:id/document/:type', protect, getApplicationDocument);
router.get('/:id/document/:type/view', protect, serveApplicationDocument);
router.get('/:id/document/:type/proxy', protect, proxyApplicationDocument);
router.get('/:id/debug', protect, debugApplicationDocument);

module.exports = router;
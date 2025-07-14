const express = require('express');
const router = express.Router();
const articleReportController = require('../controllers/articleReportController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Admin gets all reports
router.get('/', verifyToken, isAdmin, articleReportController.getAllReports);

// Admin updates report status
router.patch('/:id', verifyToken, isAdmin, articleReportController.updateReportStatus);

module.exports = router; 
const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const articleReportController = require('../controllers/articleReportController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticleById);
router.post('/', articleController.createArticle);
router.delete('/:id', articleController.deleteArticle);
router.put('/:id', articleController.updateArticle);
router.post('/:id/report', verifyToken, articleReportController.reportArticle);

module.exports = router;
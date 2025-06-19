const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticleById);
router.post('/', articleController.createArticle);
router.delete('/:id', articleController.deleteArticle);
router.put('/:id', articleController.updateArticle);

module.exports = router;
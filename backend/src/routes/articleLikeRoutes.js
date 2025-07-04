const express = require('express');
const router = express.Router();
const articleLikeController = require('../controllers/articleLikeController');

router.post('/like', articleLikeController.likeArticle);
router.post('/unlike', articleLikeController.unlikeArticle);
router.get('/:article_id/likes', articleLikeController.getArticleLikes);
router.get('/is-liked', articleLikeController.isArticleLiked);

module.exports = router;

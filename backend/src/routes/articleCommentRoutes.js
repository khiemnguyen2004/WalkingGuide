const express = require('express');
const router = express.Router();
const articleCommentController = require('../controllers/articleCommentController');

router.post('/', articleCommentController.addComment);
router.get('/:article_id', articleCommentController.getComments);
router.put('/:id', articleCommentController.updateComment);
router.delete('/:id', articleCommentController.deleteComment);

module.exports = router;

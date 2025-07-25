const AppDataSource = require('../data-source');
const notificationService = require('../services/notificationService');

function getArticleCommentRepo() {
  return AppDataSource.getRepository('ArticleComment');
}
function getArticleRepo() {
  return AppDataSource.getRepository('Article');
}

module.exports = {
  addComment: async (req, res) => {
    try {
      const { article_id, content } = req.body;
      const user_id = req.user?.id || req.body.user_id;
      if (!user_id || !article_id || !content) return res.status(400).json({ message: 'Thiếu thông tin' });
      const repo = getArticleCommentRepo();
      const comment = repo.create({ user_id, article_id, content });
      await repo.save(comment);
      // Send notification to article author
      const articleRepo = getArticleRepo();
      const article = await articleRepo.findOneBy({ article_id: parseInt(article_id) });
      if (article && article.admin_id !== user_id) {
        const noti = await notificationService.create({
          user_id: article.admin_id,
          type: 'article_comment',
          content: `Bài viết "${article.title}" của bạn vừa nhận được một bình luận mới!`,
          is_read: false,
          article_id: article.article_id,
          comment_id: comment.id // <-- Use the correct primary key for the comment
        });
        console.log('Comment notification created:', noti);
      }
      res.json(comment);
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server khi thêm bình luận' });
    }
  },
  getComments: async (req, res) => {
    try {
      const { article_id } = req.params;
      const repo = getArticleCommentRepo();
      const comments = await repo.find({ where: { article_id: parseInt(article_id) }, order: { created_at: 'DESC' } });
      res.json(comments);
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server khi lấy bình luận' });
    }
  },
  updateComment: async (req, res) => {
    try {
      const { id } = req.params;
      const { content, user_id } = req.body;
      if (!user_id || !content) return res.status(400).json({ message: 'Thiếu thông tin' });
      const repo = AppDataSource.getRepository('ArticleComment');
      const comment = await repo.findOneBy({ id: parseInt(id) });
      if (!comment) return res.status(404).json({ message: 'Không tìm thấy bình luận' });
      if (comment.user_id !== user_id) return res.status(403).json({ message: 'Không có quyền sửa bình luận này' });
      comment.content = content;
      await repo.save(comment);
      res.json(comment);
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server khi sửa bình luận' });
    }
  },
  deleteComment: async (req, res) => {
    try {
      const { id } = req.params;
      const { user_id } = req.body;
      const repo = AppDataSource.getRepository('ArticleComment');
      const comment = await repo.findOneBy({ id: parseInt(id) });
      if (!comment) return res.status(404).json({ message: 'Không tìm thấy bình luận' });
      if (comment.user_id !== user_id) return res.status(403).json({ message: 'Không có quyền xóa bình luận này' });
      await repo.delete({ id: parseInt(id) });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server khi xóa bình luận' });
    }
  },
};

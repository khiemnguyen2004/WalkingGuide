const { AppDataSource } = require('../data-source');

module.exports = {
  likeArticle: async (req, res) => {
    try {
      const { article_id } = req.body;
      const user_id = req.user?.id || req.body.user_id;
      if (!user_id || !article_id) return res.status(400).json({ message: 'Thiếu thông tin' });
      const repo = AppDataSource.getRepository('ArticleLike');
      const existing = await repo.findOneBy({ user_id, article_id });
      if (existing) return res.status(400).json({ message: 'Đã thích bài viết này' });
      const like = repo.create({ user_id, article_id });
      await repo.save(like);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server khi thích bài viết' });
    }
  },
  unlikeArticle: async (req, res) => {
    try {
      const { article_id } = req.body;
      const user_id = req.user?.id || req.body.user_id;
      if (!user_id || !article_id) return res.status(400).json({ message: 'Thiếu thông tin' });
      const repo = AppDataSource.getRepository('ArticleLike');
      await repo.delete({ user_id, article_id });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server khi bỏ thích bài viết' });
    }
  },
  getArticleLikes: async (req, res) => {
    try {
      const { article_id } = req.params;
      const repo = AppDataSource.getRepository('ArticleLike');
      const count = await repo.countBy({ article_id: parseInt(article_id) });
      res.json({ count });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server khi lấy lượt thích' });
    }
  },
  isArticleLiked: async (req, res) => {
    try {
      const { article_id, user_id } = req.query;
      const repo = AppDataSource.getRepository('ArticleLike');
      const liked = await repo.findOneBy({ article_id: parseInt(article_id), user_id: parseInt(user_id) });
      res.json({ liked: !!liked });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server khi kiểm tra thích' });
    }
  }
};

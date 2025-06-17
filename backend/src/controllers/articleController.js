const { AppDataSource } = require("../data-source");

module.exports = {
  getAllArticles: async (req, res) => {
    try {
      const articleRepo = AppDataSource.getRepository("Article");
      const articles = await articleRepo.find();
      res.json(articles);
    } catch (err) {
      console.error("Lỗi khi lấy bài viết:", err);
      res.status(500).json({ message: "Lỗi server khi lấy bài viết" });
    }
  },

  createArticle: async (req, res) => {
    try {
      const articleRepo = AppDataSource.getRepository("Article");
      const { admin_id, title, content, image_url } = req.body;
      if (!admin_id || !title) {
        return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
      }
      const newArticle = articleRepo.create({ admin_id, title, content, image_url });
      const saved = await articleRepo.save(newArticle);
      res.status(201).json(saved);
    } catch (err) {
      res.status(500).json({ message: "Lỗi server khi tạo bài viết" });
    }
  },

  updateArticle: async (req, res) => {
    try {
      const articleRepo = AppDataSource.getRepository("Article");
      const { id } = req.params;
      const { title, content, image_url } = req.body;
      const article = await articleRepo.findOneBy({ article_id: parseInt(id) });
      if (!article) return res.status(404).json({ message: "Không tìm thấy bài viết" });
      if (title !== undefined) article.title = title;
      if (content !== undefined) article.content = content;
      if (image_url !== undefined) article.image_url = image_url;
      await articleRepo.save(article);
      res.json(article);
    } catch (err) {
      res.status(500).json({ message: "Lỗi server khi cập nhật bài viết" });
    }
  },

  deleteArticle: async (req, res) => {
    try {
      const articleRepo = AppDataSource.getRepository("Article");
      const { id } = req.params;
      const article = await articleRepo.findOneBy({ article_id: parseInt(id) });
      if (!article) return res.status(404).json({ message: "Không tìm thấy bài viết" });
      await articleRepo.remove(article);
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: "Lỗi server khi xóa bài viết" });
    }
  },
};

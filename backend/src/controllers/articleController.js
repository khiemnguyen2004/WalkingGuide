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
};

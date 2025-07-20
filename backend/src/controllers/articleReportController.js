const AppDataSource = require('../data-source');
const ArticleReport = require('../models/ArticleReport');

function getRepo() {
  return AppDataSource.getRepository(ArticleReport);
}

// User reports an article
const reportArticle = async (req, res) => {
  console.log('reportArticle called');
  try {
    const { id: article_id } = req.params;
    const { reason } = req.body;
    const user_id = req.user.id;
    console.log('Params:', article_id, 'Reason:', reason, 'User:', user_id);
    if (!reason) return res.status(400).json({ message: 'Reason is required.' });
    const repo = getRepo();
    console.log('Got repo');
    const report = repo.create({ article_id, user_id, reason });
    console.log('Created report:', report);
    await repo.save(report);
    console.log('Saved report');
    res.status(201).json(report);
  } catch (err) {
    console.error('Report Article Error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Admin gets all reports
const getAllReports = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(ArticleReport);
    const reports = await repo.find({ order: { created_at: 'DESC' } });
    res.json(reports);
  } catch (err) {
    console.error('Get All Reports Error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Admin updates report status
const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['pending', 'resolved', 'dismissed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }
    const repo = AppDataSource.getRepository(ArticleReport);
    await repo.update(id, { status });
    res.json({ message: 'Status updated.' });
  } catch (err) {
    console.error('Update Report Status Error:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  reportArticle,
  getAllReports,
  updateReportStatus,
}; 
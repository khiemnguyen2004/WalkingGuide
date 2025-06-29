const express = require("express");
const router = express.Router();
const notiService = require("../services/notificationService");

// Get all notifications
router.get("/", async (req, res) => {
  try {
    const notifications = await notiService.findAll();
    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Get notifications by user ID
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const notifications = await notiService.findByUserId(userId);
    res.json(notifications);
  } catch (err) {
    console.error("Error fetching user notifications:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Get unread notifications count for user
router.get("/user/:userId/unread-count", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const count = await notiService.getUnreadCount(userId);
    res.json({ count });
  } catch (err) {
    console.error("Error fetching unread count:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Get notification by ID
router.get("/:id", async (req, res) => {
  try {
    const result = await notiService.findById(req.params.id);
    result ? res.json(result) : res.status(404).json({ message: "Not found" });
  } catch (err) {
    console.error("Error fetching notification:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Create notification
router.post("/", async (req, res) => {
  try {
    const notification = await notiService.create(req.body);
    res.status(201).json(notification);
  } catch (err) {
    console.error("Error creating notification:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Update notification (mark as read)
router.put("/:id", async (req, res) => {
  try {
    const result = await notiService.update(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    console.error("Error updating notification:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Mark all notifications as read for user
router.put("/user/:userId/mark-all-read", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    await notiService.markAllAsRead(userId);
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("Error marking notifications as read:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Delete notification
router.delete("/:id", async (req, res) => {
  try {
    await notiService.remove(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.error("Error deleting notification:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Create tour reminder notification
router.post("/tour-reminder", async (req, res) => {
  try {
    const { user_id, tour_id, tour_name, reminder_date } = req.body;
    const content = `Nhắc nhở: Bạn có tour "${tour_name}" vào ngày ${reminder_date}. Hãy chuẩn bị sẵn sàng!`;
    
    const notification = await notiService.create({
      user_id,
      content,
      type: 'tour_reminder',
      tour_id,
      is_read: false
    });
    
    res.status(201).json(notification);
  } catch (err) {
    console.error("Error creating tour reminder:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

module.exports = router; 
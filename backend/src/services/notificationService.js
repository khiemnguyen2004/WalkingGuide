const AppDataSource = require("../data-source");

function getNotiRepo() {
  return AppDataSource.getRepository("Notification");
}

module.exports = {
  findAll: () => getNotiRepo().find(),
  findById: (id) => getNotiRepo().findOneBy({ notification_id: id }),
  findByUserId: (userId) => getNotiRepo().find({ 
    where: { user_id: userId },
    order: { created_at: 'DESC' }
  }),
  getUnreadCount: async (userId) => {
    const count = await getNotiRepo().count({
      where: { user_id: userId, is_read: false }
    });
    return count;
  },
  create: (data) => getNotiRepo().save(getNotiRepo().create(data)),
  update: async (id, data) => { 
    await getNotiRepo().update({ notification_id: id }, data); 
    return getNotiRepo().findOneBy({ notification_id: id }); 
  },
  markAllAsRead: async (userId) => {
    await getNotiRepo().update(
      { user_id: userId, is_read: false },
      { is_read: true }
    );
  },
  remove: (id) => getNotiRepo().delete({ notification_id: id }),
  
  // Create tour reminder notification
  createTourReminder: async (userId, tourId, tourName, reminderDate) => {
    const content = `⏰ Nhắc nhở: Tour "${tourName}" sẽ bắt đầu vào ${reminderDate}. Hãy chuẩn bị sẵn sàng cho chuyến đi tuyệt vời!`;
    return getNotiRepo().save(getNotiRepo().create({
      user_id: userId,
      content,
      type: 'tour_reminder',
      tour_id: tourId,
      is_read: false
    }));
  },
  
  // Create tour completion notification
  createTourCompletion: async (userId, tourName) => {
    const content = `🎊 Chúc mừng! Bạn đã hoàn thành tour "${tourName}". Hy vọng bạn đã có một chuyến đi tuyệt vời với nhiều kỷ niệm đáng nhớ!`;
    return getNotiRepo().save(getNotiRepo().create({
      user_id: userId,
      content,
      type: 'tour_completion',
      is_read: false
    }));
  },
  
  // Create new tour created notification
  createTourCreated: async (userId, tourName) => {
    const content = `🎉 Tour "${tourName}" đã được tạo thành công! Bạn có thể xem chi tiết trong trang "Tour của tôi". Nếu bạn đã đặt thời gian bắt đầu, bạn sẽ nhận được nhắc nhở tự động.`;
    return getNotiRepo().save(getNotiRepo().create({
      user_id: userId,
      content,
      type: 'tour_created',
      is_read: false
    }));
  }
};

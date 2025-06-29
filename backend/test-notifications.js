const { AppDataSource } = require("./src/data-source");
const notiService = require("./src/services/notificationService");

async function createTestNotifications() {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");

    // Create test notifications for user ID 1 (assuming it exists)
    const userId = 1;

    // Test tour created notification
    await notiService.createTourCreated(userId, "Tour khám phá Hà Nội");
    console.log("Created tour created notification");

    // Test tour reminder notification
    await notiService.createTourReminder(userId, 1, "Tour khám phá Hà Nội", "2024-01-15");
    console.log("Created tour reminder notification");

    // Test tour completion notification
    await notiService.createTourCompletion(userId, "Tour khám phá Hà Nội");
    console.log("Created tour completion notification");

    // Create a general notification
    await notiService.create({
      user_id: userId,
      content: "Chào mừng bạn đến với Walking Guide! Hãy khám phá những địa điểm tuyệt vời.",
      type: 'welcome',
      is_read: false
    });
    console.log("Created welcome notification");

    console.log("All test notifications created successfully!");
  } catch (error) {
    console.error("Error creating test notifications:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

createTestNotifications(); 
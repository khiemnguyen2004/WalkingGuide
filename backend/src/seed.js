const { AppDataSource } = require('./data-source');
const Place = require('./models/Place');
const Tag = require('./models/Tag');
const PlaceTag = require('./models/Place_Tag');
const Article = require('./models/Article');
const User = require('./models/User');
const bcrypt = require("bcryptjs");

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log("Kết nối database thành công!");

    const placeRepo = AppDataSource.getRepository("Place");
    const tagRepo = AppDataSource.getRepository("Tag");
    const placeTagRepo = AppDataSource.getRepository("PlaceTag");
    const articleRepo = AppDataSource.getRepository("Article");
    const userRepo = AppDataSource.getRepository("User");

  const userToDelete = await userRepo.findOneBy({ id: 1 });
  if (userToDelete) {
    await userRepo.remove(userToDelete);
    console.log("🗑️ Đã xóa người dùng có ID = 1");
  } else {
    console.log("ℹ️ Không tìm thấy người dùng có ID = 1 để xóa");
  }
  } catch (err) {
    console.error("Lỗi seed:", err);
  } finally {
    console.log("Đóng kết nối database.");
    await AppDataSource.destroy();
  }
}

seed();

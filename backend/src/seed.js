const { AppDataSource } = require('./data-source');
const Place = require('./models/Place');
const Tag = require('./models/Tag');
const PlaceTag = require('./models/Place_Tag');
const Article = require('./models/Article');

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log("Kết nối database thành công!");

    const placeRepo = AppDataSource.getRepository("Place");
    const tagRepo = AppDataSource.getRepository("Tag");
    const placeTagRepo = AppDataSource.getRepository("PlaceTag");
    const articleRepo = AppDataSource.getRepository("Article");

  // ===== Thêm địa điểm Hòn Chồng =====
let nhaThoNui = await placeRepo.findOneBy({ name: "Nhà Thờ Núi" });
if (!nhaThoNui) {
  nhaThoNui = await placeRepo.save({
    name: "Nhà Thờ Núi",
    description: "Nhà thờ đá cổ kính nằm trên đỉnh đồi nhỏ trung tâm TP Nha Trang.",
    latitude: 12.2451,
    longitude: 109.1909,
    image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRbpl3RYR2z3_nb8om4cFs9lkmeNtuFVpUBQ&s",
    rating: 4.6,
  });
  console.log("Thêm Nhà Thờ Núi thành công!");
}



  } catch (err) {
    console.error("Lỗi seed:", err);
  } finally {
    console.log("Đóng kết nối database.");
    await AppDataSource.destroy();
  }
}

seed();

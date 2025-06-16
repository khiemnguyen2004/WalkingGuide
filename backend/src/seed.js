const { AppDataSource } = require('./data-source');
const Place = require('./models/Place');
const Tag = require('./models/Tag');
const PlaceTag = require('./models/Place_Tag');
const Article = require('./models/Article');

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Kết nối database thành công!");

    const placeRepo = AppDataSource.getRepository("Place");
    const tagRepo = AppDataSource.getRepository("Tag");
    const placeTagRepo = AppDataSource.getRepository("PlaceTag");
    const articleRepo = AppDataSource.getRepository("Article");

    // ===== 1. Seed Place =====
    let place = await placeRepo.findOneBy({ name: "Tháp Bà Ponagar" });
    if (!place) {
      place = await placeRepo.save({
        name: "Tháp Bà Ponagar",
        description: "Di tích lịch sử nổi tiếng ở Nha Trang.",
        latitude: 12.2659,
        longitude: 109.1983,
        image_url: "https://mocban.vn/wp-content/uploads/2024/05/thap-ba-ponagar-3.jpg",
        rating: 4.7
      });
      console.log("✅ Thêm Place thành công!");
    }

    // ===== 2. Seed Tags =====
    let tag1 = await tagRepo.findOneBy({ name: "Lịch sử" });
    if (!tag1) tag1 = await tagRepo.save({ name: "Lịch sử" });

    let tag2 = await tagRepo.findOneBy({ name: "Thiên nhiên" });
    if (!tag2) tag2 = await tagRepo.save({ name: "Thiên nhiên" });

    console.log("✅ Thêm Tag thành công!");

    // ===== 3. Seed PlaceTags (Nối tag với place) =====
    const existingPT1 = await placeTagRepo.findOneBy({ place_id: place.id, tag_id: tag1.id });
    if (!existingPT1) {
      await placeTagRepo.save({ place_id: place.id, tag_id: tag1.id });
    }

    const existingPT2 = await placeTagRepo.findOneBy({ place_id: place.id, tag_id: tag2.id });
    if (!existingPT2) {
      await placeTagRepo.save({ place_id: place.id, tag_id: tag2.id });
    }

    console.log("✅ Gán tag cho place thành công!");

    // ===== 4. Seed Articles =====
    const existingArticle = await articleRepo.findOneBy({ title: "Khám phá Tháp Bà Ponagar" });
    if (!existingArticle) {
      await articleRepo.save({
        admin_id: 1, // đảm bảo user_id này tồn tại
        title: "Khám phá Tháp Bà Ponagar",
        content: "Một trong những địa điểm không thể bỏ qua khi đến Nha Trang.",
        image_url: "https://www.homepaylater.vn/static/ea0068f36e22e004c92c85af9c002f26/2_hon_chong_nam_cach_trung_tam_thanh_pho_chi_khoang_3_km_1220890f75.jpg"
      });
      console.log("✅ Thêm bài viết thành công!");
    }
    // ===== 5. Seed Tours =====
    const tourRepo = AppDataSource.getRepository("Tour");
    const existingTour = await tourRepo.findOneBy({ name: "Tour khám phá Nha Trang 1 ngày" });

    if (!existingTour) {
      await tourRepo.save({
        user_id: 1,
        name: "Tour khám phá Nha Trang 1 ngày",
        description: "Tour tham quan các điểm nổi bật như Tháp Bà, Hòn Chồng, Nhà Thờ Núi...",
        image_url: "https://cdn2.tuoitre.vn/471584752817336320/2023/4/18/tp-nha-trang-16818161974101240202452.jpeg"
      });
      console.log("✅ Thêm Tour thành công!");
    }

  } catch (err) {
    console.error("❌ Lỗi seed:", err);
  } finally {
    console.log("🛑 Đóng kết nối database.");
    await AppDataSource.destroy();
  }
}

seed();

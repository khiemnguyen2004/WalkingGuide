// Script to seed more diverse places in Vietnam
const axios = require('axios');

const places = [
  {
    name: "Hạ Long Bay",
    description: "Di sản thiên nhiên thế giới nổi tiếng với hàng nghìn đảo đá vôi kỳ vĩ.",
    latitude: 20.9101,
    longitude: 107.1839,
    image_url: "https://cdn.vietnam.travel/sites/default/files/halongbay.jpg",
    rating: 4.9
  },
  {
    name: "Phố cổ Hội An",
    description: "Khu phố cổ duyên dáng với đèn lồng, di sản văn hóa thế giới.",
    latitude: 15.8801,
    longitude: 108.3380,
    image_url: "https://cdn.vietnam.travel/sites/default/files/hoian.jpg",
    rating: 4.8
  },
  {
    name: "Bà Nà Hills",
    description: "Khu du lịch nổi tiếng với Cầu Vàng, khí hậu mát mẻ quanh năm.",
    latitude: 16.0218,
    longitude: 108.0179,
    image_url: "https://cdn.vietnam.travel/sites/default/files/banahills.jpg",
    rating: 4.7
  },
  {
    name: "Sa Pa",
    description: "Thị trấn vùng cao với ruộng bậc thang, núi Fansipan và bản làng dân tộc.",
    latitude: 22.3402,
    longitude: 103.8448,
    image_url: "https://cdn.vietnam.travel/sites/default/files/sapa.jpg",
    rating: 4.8
  },
  {
    name: "Đà Lạt",
    description: "Thành phố ngàn hoa, khí hậu ôn hòa, nhiều điểm check-in lãng mạn.",
    latitude: 11.9404,
    longitude: 108.4583,
    image_url: "https://cdn.vietnam.travel/sites/default/files/dalat.jpg",
    rating: 4.7
  },
  {
    name: "Côn Đảo",
    description: "Quần đảo hoang sơ, biển xanh cát trắng, lịch sử hào hùng.",
    latitude: 8.6956,
    longitude: 106.6013,
    image_url: "https://cdn.vietnam.travel/sites/default/files/condao.jpg",
    rating: 4.6
  },
  {
    name: "Ninh Bình",
    description: "Vịnh Hạ Long trên cạn với Tràng An, Tam Cốc, chùa Bái Đính.",
    latitude: 20.2506,
    longitude: 105.9745,
    image_url: "https://cdn.vietnam.travel/sites/default/files/ninhbinh.jpg",
    rating: 4.8
  },
  {
    name: "Mũi Né",
    description: "Biển xanh, đồi cát bay, làng chài và các hoạt động thể thao nước.",
    latitude: 10.9333,
    longitude: 108.2833,
    image_url: "https://cdn.vietnam.travel/sites/default/files/muine.jpg",
    rating: 4.5
  },
  {
    name: "Cần Thơ",
    description: "Thành phố miền Tây với chợ nổi Cái Răng, vườn trái cây, sông nước hữu tình.",
    latitude: 10.0452,
    longitude: 105.7469,
    image_url: "https://cdn.vietnam.travel/sites/default/files/cantho.jpg",
    rating: 4.6
  },
  {
    name: "Phú Quốc",
    description: "Đảo ngọc với bãi biển đẹp, resort sang trọng, hải sản tươi ngon.",
    latitude: 10.2270,
    longitude: 103.9637,
    image_url: "https://cdn.vietnam.travel/sites/default/files/phuquoc.jpg",
    rating: 4.9
  }
];

async function seedPlaces() {
  for (const place of places) {
    try {
      await axios.post('http://localhost:3000/api/places', place);
      console.log('Created:', place.name);
    } catch (err) {
      console.error('Error creating', place.name, err.response?.data || err.message);
    }
  }
}

seedPlaces();

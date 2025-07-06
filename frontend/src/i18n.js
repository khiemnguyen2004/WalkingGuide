import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'Home': 'Home',
      'Explore': 'Explore',
      'My Tours': 'My Tours',
      'Profile': 'Profile',
      'Login': 'Login',
      'Register': 'Register',
      'Logout': 'Logout',
      'Notifications': 'Notifications',
      'Discover & Plan Your Smart Trip': 'Discover & Plan Your Smart Trip',
      'Find places, create your own itinerary, or let us suggest the perfect trip for you!': 'Find places, create your own itinerary, or let us suggest the perfect trip for you!',
      'Start Planning': 'Start Planning',
      'Manual Planning': 'Manual Planning',
      'Want to plan your own trip? Use manual mode to create your custom tour.': 'Want to plan your own trip? Use manual mode to create your custom tour.',
      'Auto Planning': 'Auto Planning',
      'Want us to create a suitable itinerary? Try auto mode for our suggestions!': 'Want us to create a suitable itinerary? Try auto mode for our suggestions!',
      'No plans yet? Explore the travel map!': 'No plans yet? Explore the travel map!',
      // Add more translations as needed
    }
  },
  vi: {
    translation: {
      'Home': 'Trang chủ',
      'Explore': 'Khám phá',
      'My Tours': 'Tour của bạn',
      'Profile': 'Hồ sơ',
      'Login': 'Đăng nhập',
      'Register': 'Đăng ký',
      'Logout': 'Đăng xuất',
      'Notifications': 'Thông báo',
      'Discover & Plan Your Smart Trip': 'Khám phá & Lên Kế Hoạch Du Lịch Thông Minh',
      'Find places, create your own itinerary, or let us suggest the perfect trip for you!': 'Tìm kiếm địa điểm, tạo lộ trình cá nhân hoặc để chúng tôi gợi ý chuyến đi hoàn hảo cho bạn!',
      'Start Planning': 'Bắt đầu lên kế hoạch',
      'Manual Planning': 'Tự tạo lộ trình',
      'Want to plan your own trip? Use manual mode to create your custom tour.': 'Bạn muốn tự lên kế hoạch chuyến đi? Hãy sử dụng chế độ thủ công để tự tạo tour theo ý thích của mình.',
      'Auto Planning': 'Tạo lộ trình tự',
      'Want us to create a suitable itinerary? Try auto mode for our suggestions!': 'Bạn muốn chúng tôi tạo lộ trình phù hợp? Hãy thử chế độ tự động để chúng tôi đề xuất tour cho bạn!',
      'No plans yet? Explore the travel map!': 'Bạn chưa có dự định? Hãy cùng khám phá bản đồ du lịch!',
      'Trips & Itineraries': 'Chuyến đi & Lịch trình',
      'Featured Destinations': 'Điểm đến nổi bật',
      'Read interesting shares from travelers': 'Đọc những chia sẻ thú vị từ các du khách',
      // Add more translations as needed
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

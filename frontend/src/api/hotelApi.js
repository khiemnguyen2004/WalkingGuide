import axiosClient from './axiosClient';

const hotelApi = {
  bookHotel: (data) => axiosClient.post('/hotels/hotel-bookings', data),
  getUserHotelBookings: (userId) => axiosClient.get(`/hotels/hotel-bookings/user/${userId}`),
};

export default hotelApi; 
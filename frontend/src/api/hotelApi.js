import axiosClient from './axiosClient';

const hotelApi = {
  bookHotel: (data) => axiosClient.post('/hotels/hotel-bookings', data),
};

export default hotelApi; 
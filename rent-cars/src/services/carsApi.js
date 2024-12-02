// import axios from "axios";

// axios.defaults.baseURL = "https://65ccb5afdd519126b83f58c1.mockapi.io/api";

// const LIMIT = "12";

// export const getAllCars = async (params) => {
//   for (var key in params) {
//     if (!params[key]) {
//       delete params[key];
//     }
//   }

//   var searchParams = new URLSearchParams(params);

//   var queryString = searchParams.toString();

//   const { data } = await axios(`/adverts?limit=${LIMIT}&${queryString}`);

//   return data;
// };

import axios from "axios";

const API_URL = "http://localhost:5555/car/cars";

export const getAllCars = async ({ make, price, from, to }) => {
  const params = { make, price, from, to };
  const response = await axios.get(API_URL, { params });
  return response.data;
};

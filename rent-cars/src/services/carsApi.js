import api from "./api";

export const getAllCars = async ({ make, price, from, to }) => {
  const params = { make, price, from, to };
  const response = await api.get("/car/cars", { params });
  return response.data;
};

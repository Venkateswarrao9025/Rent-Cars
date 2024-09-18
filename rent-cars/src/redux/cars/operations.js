import { createAsyncThunk } from "@reduxjs/toolkit";

import { getAllCars } from "../../services/carsApi";

export const getAllCarsThunk = createAsyncThunk(
  "cars/getAllCars",
  async (params, thunkApi) => {
    try {
      const response = await getAllCars(params);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

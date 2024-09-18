import { createSlice } from "@reduxjs/toolkit";

const favoritesInitialState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: favoritesInitialState,
  reducers: {
    addCar(state, action) {
      state.items.push(action.payload);
    },
    deleteCar(state, action) {
      state.items = state.items.filter((car) => car.id !== action.payload);
    },
  },
});

export const { addCar, deleteCar } = favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;

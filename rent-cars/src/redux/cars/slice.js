import { createSlice } from "@reduxjs/toolkit";
import { getAllCarsThunk } from "./operations";

const carsInitialState = {
  items: [],
  page: 1,
  brand: null,
  isLoading: false,
  error: null,
};

const carsSlice = createSlice({
  name: "cars",
  initialState: carsInitialState,
  reducers: {
    incPage(state) {
      state.page = state.page + 1;
    },
    resetCars(state) {
      state.page = 1;
      state.items = [];
    },
  },

  extraReducers: (builder) =>
    builder
      .addCase(getAllCarsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        if (state.page === 1) {
          state.items = action.payload;
        } else {
          state.items.push(...action.payload);
        }
      })
      .addCase(getAllCarsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllCarsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      }),
});

export const { incPage, resetCars } = carsSlice.actions;
export const carsReducer = carsSlice.reducer;

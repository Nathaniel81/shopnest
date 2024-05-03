import { createSlice } from "@reduxjs/toolkit";
import { StoreProduct } from "../../types";


interface AppState {
  productData: StoreProduct[];
  favoriteData: StoreProduct[];
}

const initialState: AppState = {
  productData: [],
  favoriteData: []
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingProduct = state.productData.find(
        (item: StoreProduct) => item.id === action.payload.id
      );
      if (existingProduct) {
        existingProduct.quantity += action.payload.quantity;
      } else {
        state.productData.push(action.payload);
      }
    },
    addToFavorite: (state, action) => {
      const existingProductIndex = state.favoriteData.findIndex(
        (item: StoreProduct) => item.id === action.payload.id
      );
      if (existingProductIndex !== -1) {
        state.favoriteData.splice(existingProductIndex, 1);
      } else {
        state.favoriteData.push(action.payload);
      }
    },
    resetCart: (state) => {
      state.productData = [];
    },
  },
});

export const {
  addToCart,
  addToFavorite
} = appSlice.actions;
export default appSlice.reducer;

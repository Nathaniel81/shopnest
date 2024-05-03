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

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingProduct = state.productData.find(
        (item: StoreProduct) => item._id === action.payload._id
      );
      if (existingProduct) {
        existingProduct.quantity += action.payload.quantity;
      } else {
        state.productData.push(action.payload);
      }
    },
    addToFavorite: (state, action) => {
      const existingProduct = state.favoriteData.find(
        (item: StoreProduct) => item._id === action.payload._id
      );
      if (existingProduct) {
        existingProduct.quantity += action.payload.quantity;
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
} = cartSlice.actions;
export default cartSlice.reducer;

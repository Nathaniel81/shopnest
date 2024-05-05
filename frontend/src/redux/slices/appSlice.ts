import { StoreProduct, IUser  } from "../../types";
import { createSlice  } from '@reduxjs/toolkit'

interface AppState {
  productData: StoreProduct[];
  favoriteData: StoreProduct[];
  userInfo: IUser;
}

const initialState: AppState = {
  productData: [],
  favoriteData: [],
  userInfo: {}
};

// export const login = createAsyncThunk(
//   'user/login',
//   async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
//     try {
//       const config = {
//         headers: {
//           'Content-type': 'application/json'
//         }
//       }
//       const { data } = await axios.post(`/api/user/login/`, { email, password }, config)
//       return data
//     } catch (error) {
// 		const err = error as AxiosError
// 		return rejectWithValue(err.response?.data)
//     }
//   }
// )

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
    increaseQuantity: (state, action) => {
      const existingProduct = state.productData.find(
        (item: StoreProduct) => item.id === action.payload.id
      );
      existingProduct && existingProduct.quantity++;
    },
    decreaseQuantity: (state, action) => {
      const existingProduct = state.productData.find(
        (item: StoreProduct) => item.id === action.payload.id
      );
      if (existingProduct?.quantity === 1) {
        existingProduct.quantity = 1;
      } else {
        existingProduct!.quantity--;
      }
    },
    deleteProduct: (state, action) => {
      state.productData = state.productData.filter(
        (item) => item.id !== action.payload
      );
    },
    resetCart: (state) => {
      state.productData = [];
    },
    addUser: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});

export const {
  addToCart,
  addToFavorite,
  increaseQuantity,
  decreaseQuantity,
  deleteProduct,
  resetCart,
  addUser
} = appSlice.actions;
export default appSlice.reducer;

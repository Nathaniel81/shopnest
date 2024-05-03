export interface Category {
  id: string;
  name: string
}
export interface ProductProps {
    brand: string;
    category: Category;
    description: string;
    image: string;
    main_image: string;
    is_new: boolean;
    old_price: number;
    price: number;
    title: string;
    name: string;
    id: number;
  }
export interface StoreProduct {
    brand: string;
    category: Category;
    description: string;
    image: string;
    main_image: string;
    is_new: boolean;
    old_price: number;
    price: number;
    title: string;
    name: string;
    id: number;
    quantity: number;
  }
  
export interface StateProps {
    productData: [];
    favoriteData: [];
    userInfo: null | string;
    //eslint-disable-next-line
    app: any;
  }

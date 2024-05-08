import { 
    useQuery,
    // useMutation,
    // useQueryClient,
    // useInfiniteQuery,
 } from "@tanstack/react-query";
import axios from 'axios';
import { QUERY_KEYS } from "./queryKeys";
import { SearchParams } from "../../types";


// Product Queries

const getProducts = async (filter?: string) => {
    const response = await axios.get(`/api/products/${filter}`);
    return response.data;
  };
  export const useGetProducts = (filter?: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_PRODUCTS],
      queryFn: () => getProducts(filter),
      enabled: !!filter
    });
  };

const getCategories = async () => {
    const response = await axios.get('/api/products/categories/');
    return response.data;
  };
  export const useGetCategories = () => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_CATEGORIES],
      queryFn: () => getCategories(),
    });
  };

const getProductDetail = async (id?: string) => {
    const response = await axios.get(`/api/products/${id}/`);
    return response.data;
  };
  export const useGetProductDetail = (id?: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_PRODUCT_DETAIL, id],
      queryFn: () => getProductDetail(id),
    });
  };


  const getSearchedProducts = async ({ query, category }: SearchParams) => {
    if (category === 'All') category = '';
    const response = await axios.get(`/api/products/search?query=${query}&category=${category}`);
    return response.data;
  };
  
  export const useGetSearchedProducts = (searchParams: SearchParams) => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_SEARCHED_PRODUCTS, searchParams],
      queryFn: () => getSearchedProducts(searchParams),
      enabled: !!searchParams.query,
    });
  };

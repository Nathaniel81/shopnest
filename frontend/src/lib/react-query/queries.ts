import { 
    useQuery,
    // useMutation,
    // useQueryClient,
    // useInfiniteQuery,
 } from "@tanstack/react-query";
import axios from 'axios';
import { QUERY_KEYS } from "./queryKeys";


// Product Queries

const getProducts = async () => {
    const response = await axios.get('/api/products/');
    return response.data;
  };
  export const useGetProducts = () => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_PRODUCTS],
      queryFn: () => getProducts(),
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


const getSearchedProducts = async (searchTerm: string) => {
  const response = await axios.get(`/api/products/search?query=${searchTerm}`);
  return response.data;
};
export const useGetSearchedProducts = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SEARCHED_PRODUCTS, searchTerm],
    queryFn: () => getSearchedProducts(searchTerm),
  });
};
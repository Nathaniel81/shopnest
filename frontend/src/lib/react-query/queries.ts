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

import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/slices/appSlice";
import { StoreProduct } from "../../../types";
import FormattedPrice from "../../FormattedPrice";


interface cartProductProps {
  item: StoreProduct;
}

const FavoriteProduct = ({ item }: cartProductProps) => {
  const dispatch = useDispatch();
  return (
    <div className="bg-gray-100 rounded-lg flex flex-col md:flex-row py-2 items-center gap-4 mb-2">
      <img src={item.main_image} alt="Product image" width={150} height={150} />
      <div className="flex items-center px-2 gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-lg font-semibold text-amazon_blue">{item.name}</p>
          <p className="text-sm text-gray-500">{item.description}</p>
          <p className="text-sm text-gray-600">
            Unit price:{" "}
            <span className="font-semibold text-amazon_blue">
              <FormattedPrice amount={item.price} />
            </span>
          </p>
          <button
            onClick={() => {
              dispatch(
                addToCart({
                  id: item.id,
                  brand: item.brand,
                  category: item.category,
                  description: item.description,
                  main_image: item.main_image,
                  is_new: item.is_new,
                  old_price: item.old_price,
                  price: item.price,
                  title: item.title,
                  quantity: 1,
                })
              );
            }}
            className="w-44 h-10 font-medium bg-amazon_blue text-white rounded-md hover:bg-amazon_yellow duration-300 hover:text-black mt-2"
          >
            add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default FavoriteProduct;

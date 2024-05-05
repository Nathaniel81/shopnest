import FormattedPrice from "../FormattedPrice";
import { ProductProps } from "../../types";


type Item = {
  item: ProductProps;
};

const SearchProducts = ({ item }: Item) => {
  return (
    <div className="flex items-center gap-4">
      <img className="w-24" src={item.main_image} alt="productImage" />
      <div>
        <p className="text-xs -mb-1">
          {item.brand}_{item.category.name}
        </p>
        <p className="text-lg font-medium">{item.name}</p>
        <p className="text-xs">{item.description.substring(0, 100)}</p>
        <p className="text-sm flex items-center gap-1">
          price:{" "}
          <span className="font-semibold">
            <FormattedPrice amount={item.price} />
          </span>
          <span className="text-gray-600 line-through">
            <FormattedPrice amount={item.old_price} />
          </span>
        </p>
      </div>
      <div className="flex-1 text-right px-4">
        <p className="text-base font-semibold animate-bounce text-amazon_blue">
          Save <FormattedPrice amount={item.old_price - item.price} />
        </p>
      </div>
    </div>
  );
};

export default SearchProducts;

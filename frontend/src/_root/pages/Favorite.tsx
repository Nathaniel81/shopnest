import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { StateProps, StoreProduct } from "../../types";

import FavoriteProduct from "../../components/shared/favorite/FavoriteProduct";
import ResetFavoriteItems from "../../components/shared/favorite/ResetFavoriteItems";


const FavoritePage = () => {
  const { favoriteData } = useSelector((state: StateProps) => state.app);

  return (
    <div className="max-w-screen-xl mx-auto px-6 gap-10 py-4">
      {favoriteData.length > 0 ? (
        <div className="bg-white p-4 rounded-lg">
          <div className="flex items-center justify-between border-b-[1px] border-b-gray-400 pb-1">
            <p className="text-2xl font-semibold text-amazon_blue">
              Favorte Items
            </p>
            <p className="text-lg font-semibold text-amazon_blue">Action</p>
          </div>
          <div>
            {favoriteData.map((item: StoreProduct) => (
              <div key={item.id} className="mt-2">
                <FavoriteProduct item={item} />
              </div>
            ))}
            <ResetFavoriteItems />
          </div>
        </div>
      ) : (
        <div className="bg-white h-96  flex flex-col items-center justify-center py-5 rounded-lg shadow-lg">
          <h1>Nothing is available in the Favorite list</h1>
          <Link to="/">
            <button className="w-52 h-10 bg-amazon_blue text-white rounded-lg text-sm font-semibold hover:bg-amazon_yellow hover:text-black duration-300 mt-2">
              Go to shopping
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default FavoritePage;
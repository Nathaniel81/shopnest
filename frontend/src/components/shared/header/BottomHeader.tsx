import axios from "axios";
import { useEffect, useState } from "react";
import { LuMenu } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { useGetCategories, useGetProducts } from "../../../lib/react-query/queries";
import { resetCart, resetUser } from "../../../redux/slices/appSlice";
import { Category, StateProps } from "../../../types";


const BottomHeader = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: StateProps) => state.app);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const { data: categories } = useGetCategories();
  const { refetch: refetchProducts } = useGetProducts(selectedCategory ? `?category=${selectedCategory}` : '');

  const handleSignOut = async () => {
    try {
      await axios.post(`/api/user/logout/`);
    } catch (error) {
      console.log(error);
    }
    dispatch(resetCart());
    dispatch(resetUser());
  };

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setShowDropdown(false);
    refetchProducts();
  };

  useEffect(() => {
    setShowDropdown(false);
    refetchProducts();
  }, [refetchProducts, selectedCategory]);

  return (
    <div className="w-full h-10 bg-amazon_light text-sm text-white px-4 flex items-center">
      <div
        className="flex items-center gap-1 h-8 px-2 border border-transparent hover:border-white cursor-pointer duration-300 relative"
        onMouseEnter={() => setShowDropdown(true)}
        onMouseLeave={() => setShowDropdown(false)}
      >
        <LuMenu className="text-xl" /> {selectedCategory ? selectedCategory : "All"}
        {showDropdown && categories && (
          <div className="absolute top-full left-0 bg-white py-2 px-4 shadow-lg z-10 w-[300px]">
            <p
              className="text-gray-800 hover:bg-gray-200 rounded-md px-2 py-1 cursor-pointer"
              onClick={() => handleCategorySelect("")}
            >
              {selectedCategory ? "All" : ""}
            </p>
            {categories.map((category: Category, index: number) => (
              <p
                key={index}
                className="text-gray-800 hover:bg-gray-200 rounded-md px-2 py-1 cursor-pointer"
                onClick={() => 
                  setSelectedCategory(category.name)}>
                {category.name}
              </p>
            ))}
          </div>
        )}
      </div>
      <p className="hidden md:inline-flex items-center h-8 px-2 border border-transparent hover:border-white cursor-pointer duration-300">
        Todays Deals
      </p>
      <p className="hidden md:inline-flex items-center h-8 px-2 border border-transparent hover:border-white cursor-pointer duration-300">
        Customer Service
      </p>
      <p className="hidden md:inline-flex items-center h-8 px-2 border border-transparent hover:border-white cursor-pointer duration-300">
        Registry
      </p>
      <p className="hidden md:inline-flex items-center h-8 px-2 border border-transparent hover:border-white cursor-pointer duration-300">
        Gift Cards
      </p>
      <p className="hidden md:inline-flex items-center h-8 px-2 border border-transparent hover:border-white cursor-pointer duration-300">
        Sell
      </p>
      {userInfo?.email ? (
        <button
          onClick={handleSignOut}
          className="hidden md:inline-flex items-center h-8 px-2 border border-transparent hover:border-red-600 hover:text-red-400 text-amazon_yellow cursor-pointer duration-300"
        >
          Sign Out
        </button>
      ) : (
        ""
      )}
    </div>
  );
};

export default BottomHeader;

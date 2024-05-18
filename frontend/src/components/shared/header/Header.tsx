import { useClickOutside } from '@mantine/hooks';
import { useState, useEffect } from "react";
import { FaSignOutAlt } from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi';
import {
  MdArrowDropDown,
  MdLocationOn,
  MdSearch,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { headerIcons } from "../../../constants";
import useDebounce from "../../../hooks/useDebounce";
import { useGetCategories, useGetSearchedProducts } from "../../../lib/react-query/queries";
import { Category, StateProps, StoreProduct } from "../../../types";
import SearchProducts from "../SearchProduct";


const Header = () => {
  const cartIcon = headerIcons[0].imgURL;
  const logo = headerIcons[1].imgURL;
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { data: categories } = useGetCategories();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch('/api/user/get-location/');
        const data = await response.json();
        if (data.country) {
          setLocation(data.country_name);
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    fetchLocation();
  }, []);

  const ref = useClickOutside(() => {
   setSidebarOpen(false);
});

  const { 
    productData: cartItems, 
    favoriteData,
    userInfo
  } = useSelector(
    (state: StateProps) => state.app
  );

  const [showAll, setShowAll] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearch = useDebounce({ query: searchQuery, category: selectedCategory }, 500);
  const {
    data: searchedProducts, 
    isFetching: isSearchFetching,
  } = useGetSearchedProducts(debouncedSearch);


const toggleSidebar = () => {
  setSidebarOpen(!sidebarOpen);
}


  return (
    <div className="sticky top-0 z-50">
      <div className="w-full bg-amazon_blue text-white px-4 py-3 flex md:justify-between items-center gap-2 md:gap-4 lgl:gap-2 xl:gap-4">
        <button className="lg:hidden border p-2 border-transparent hover:border-white cursor-pointer duration-300" onClick={toggleSidebar}>
          <FiMenu size={24} />
        </button>
        {sidebarOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50">
              <div ref={ref} className="absolute inset-y-0 left-0 w-64 bg-gray-900 text-white">
                <div onClick={() => setSidebarOpen(false)} className="p-4">
                  <div>
                    {userInfo?.email ? (
                      <div className="flex items-center p-2 border border-transparent hover:border-white cursor-pointer duration-300 h-[70%] gap-1">
                          <div className="text-xs text-gray-100 flex flex-col justify-between">
                            <p className="text-white font-bold">{userInfo.username}</p>
                            <p>{userInfo.email}</p>
                          </div>
                        </div>
                      ) : (
                      <Link to="/sign-in">
                        <div className="flex flex-col items-start justify-center p-2 hover:border-white cursor-pointer duration-300 border border-transparent">
                          <p className="text-xs text-lightText font-light">
                            Hello, sign in
                          </p>
                          <p className="hidden lg:inline-flex text-sm font-semibold -mt-1 text-whiteText">
                            Accounts & Lists{" "}
                          </p>
                        </div>
                      </Link>
                      )}
                  </div>
                  <div>
                    {userInfo?.email ? (
                      <Link
                        to={"/favorite"}
                        className="p-2 text-xs text-gray-100 flex flex-col justify-center px-2 border border-transparent hover:border-white cursor-pointer duration-300 h-[70%] relative"
                      >
                      <p>Marked</p>
                      <p className="text-white font-bold">& Favorite</p>
                      {favoriteData.length > 0 && (
                        <span className="absolute right-2 top-2 w-4 h-4 border-[1px] border-gray-400 flex items-center justify-center text-xs text-amazon_yellow">
                          {favoriteData.length}
                        </span>
                      )}
                      </Link>
                    ): (
                      <div className="flex flex-col items-start justify-center headerHover p-2 hover:border-white cursor-pointer duration-300 border border-transparent">
                        <p className="text-xs text-lightText font-light">Returns</p>
                        <p className="text-sm font-semibold -mt-1 text-whiteText">& Orders</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Link
                      to={"/cart"}
                      className="flex items-center p-2 border border-transparent hover:border-white cursor-pointer duration-300 h-[70%] relative"
                    >
                      <img
                        className="w-auto object-cover h-8"
                        src={cartIcon}
                        alt="cartImg"
                      />
                      <p className="text-xs text-white font-bold mt-3">Cart</p>
                      <span className="absolute text-amazon_yellow text-sm top-2 left-[30px] font-semibold">
                        {cartItems.length > 0 ? cartItems.length : 0}
                      </span>
                    </Link>
                  </div>
                  {userInfo?.email && (
                    <div className='flex items-center p-2 border border-transparent hover:border-white cursor-pointer duration-300 h-[70%] relative'>
                      <div
                        className="flex items-center"
                      >
                         <FaSignOutAlt size={30} />
                         <p className="text-xs font-semibold text-whiteText px-2">
                           Log out
                         </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
        )}
        <Link to="/">
          <div className="headerHover">
            <img className="w-24 mt-2" src={logo} alt="logoImage" />
          </div>
        </Link>
        <div className="hidden lg:inline-flex headerHover">
          <MdLocationOn />
          <p className="flex flex-col text-xs text-lightText font-light">
            Deliver to{" "}
            <span className="text-sm font-semibold -mt-1 text-whiteText">
              {location}
            </span>
          </p>
        </div>
        <div className="flex h-10 rounded-md flex-grow relative">
          <span
            onClick={() => setShowAll(!showAll)}
            className="px-2 h-full bg-gray-200 hover:bg-gray-300 border-2 cursor-pointer duration-300 text-sm text-amazon_blue font-titleFont flex items-center justify-center rounded-tl-md rounded-bl-md"
          >
            {selectedCategory}{" "}
            <span>
              <MdArrowDropDown />
            </span>
          </span>
          {showAll && (
            <div className="absolute top-full left-0 bg-white py-2 px-4 shadow-lg z-10 w-full sm:w-[300px]">
              <p
                className="text-gray-800 hover:bg-gray-200 rounded-md px-2 py-1 cursor-pointer"
                onClick={() => {
                  setSelectedCategory("All")
                  setShowAll(false)
                }}
              >
                {selectedCategory ? 'All' : ''}
              </p>
              {categories.map((category: Category, index: number) => (
                <p
                  key={index}
                  className="text-gray-800 hover:bg-gray-200 rounded-md px-2 py-1 cursor-pointer"
                  onClick={() => {
                    setSelectedCategory(category.name)
                    setShowAll(false)
                  }}
                >
                  {category.name}
                </p>
              ))}
            </div>
          )}
          <input
            onChange={handleSearch}
            value={searchQuery}
            className="h-full text-base text-amazon_blue flex-grow outline-none border-none px-2"
            type="text"
          />
          <span className="w-12 h-full flex items-center justify-center bg-amazon_yellow hover:bg-[#f3a847] duration-300 text-amazon_blue cursor-pointer rounded-tr-md rounded-br-md">
            <MdSearch />
          </span>
          {searchQuery && (
            <div className="absolute left-0 top-12 w-full mx-auto max-h-96 bg-gray-200 rounded-lg overflow-y-scroll cursor-pointer text-black">
              {searchedProducts?.length > 0 ? (
                <>
                  {searchQuery &&
                    searchedProducts.map((item: StoreProduct) => (
                      <Link
                        to={`/${item.id}`}
                        key={item.id}
                        className="w-full border-b-[1px] border-b-gray-400 flex items-center gap-4"
                        onClick={() => setSearchQuery("")}
                      >
                        <SearchProducts item={item} />
                      </Link>
                    ))}
                </>
              ) : (
                <div className="bg-gray-50 flex items-center justify-center py-10 rounded-lg shadow-lg">
                  {isSearchFetching ? (
                    <div className="w-full flex flex-col gap-6 items-center justify-center">
                      <BeatLoader color="#131921" size={10} />
                    </div>
                  ) : (
                    <p className="text-xl font-semibold">
                      {searchQuery && searchedProducts?.length < 1 && "Nothing matches with your search keywords."}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {userInfo?.email ? (
          <div className="hidden lg:flex items-center p-2 border border-transparent hover:border-white cursor-pointer duration-300 h-[70%] gap-1">
            <div className="text-xs text-gray-100 flex flex-col justify-between">
              <p className="text-white font-bold">{userInfo.username}</p>
              <p>{userInfo.email}</p>
            </div>
          </div>
        ) : (
        <Link to="/sign-in">
          <div className="hidden lg:flex flex-col items-start justify-center p-2 hover:border-white cursor-pointer duration-300 border border-transparent">
            <p className="text-xs text-lightText font-light">
              Hello, sign in
            </p>
            <p className="hidden lg:inline-flex text-sm font-semibold -mt-1 text-whiteText">
              Accounts & Lists{" "}
            </p>
          </div>
        </Link>
        )}

        {userInfo?.email ? (
          <Link
            to={"/favorite"}
            className="hidden p-2 text-xs text-gray-100 lg:flex flex-col justify-center px-2 border border-transparent hover:border-white cursor-pointer duration-300 h-[70%] relative"
          >
          <p>Marked</p>
          <p className="text-white font-bold">& Favorite</p>
          {favoriteData.length > 0 && (
            <span className="absolute right-2 top-2 w-4 h-4 border-[1px] border-gray-400 flex items-center justify-center text-xs text-amazon_yellow">
              {favoriteData.length}
            </span>
          )}
          </Link>
        ): (
          <>
          <div className="hidden lg:flex flex-col items-start justify-center headerHover p-2 hover:border-white cursor-pointer duration-300 border border-transparent">
            <p className="text-xs text-lightText font-light">Returns</p>
            <p className="text-sm font-semibold -mt-1 text-whiteText">& Orders</p>
          </div>
          </>
        )}

        <Link
          to={"/cart"}
          className="hidden lg:flex items-center p-2 border border-transparent hover:border-white cursor-pointer duration-300 h-[70%] relative"
        >
          <img
            className="w-auto object-cover h-8"
            src={cartIcon}
            alt="cartImg"
          />
          <p className="text-xs text-white font-bold mt-3">Cart</p>
          <span className="absolute text-amazon_yellow text-sm top-2 left-[30px] font-semibold">
          {cartItems.length > 0 ? cartItems.length : 0}
          </span>
        </Link>
      </div>
      
    </div>
  );
};

export default Header;

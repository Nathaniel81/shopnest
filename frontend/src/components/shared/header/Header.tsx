import { useState, useEffect } from "react";
import {
  MdArrowDropDown,
  // MdExitToApp,
  MdLocationOn,
  MdSearch,
  // MdShoppingCart
} from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import useDebounce from "../../../hooks/useDebounce";
import { useGetSearchedProducts, useGetCategories } from "../../../lib/react-query/queries";
import { StateProps, StoreProduct, Category } from "../../../types";
import SearchProducts from "../SearchProduct";
import { headerIcons } from "../../../constants";


const Header = () => {
  const cartIcon = headerIcons[0].imgURL;
  const logo = headerIcons[1].imgURL;
  const [isHovered, setIsHovered] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { data: categories } = useGetCategories();


  const { 
    productData: cartItems, 
    // favoriteData, 
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

  useEffect(() => {
    console.log(searchedProducts);
  }, [searchedProducts]);


  return (
    <div className="sticky top-0 z-50">
      <div className="w-full bg-amazon_blue text-white px-4 py-3 flex md:justify-between items-center gap-2 md:gap-4 lgl:gap-2 xl:gap-4">
        <Link to="/">
          <div className="headerHover">
            <img className="w-24 mt-2" src={logo} alt="logoImage" />
          </div>
        </Link>
        <div className="hidden md:inline-flex headerHover">
          <MdLocationOn />
          <p className="flex flex-col text-xs text-lightText font-light">
            Deliver to{" "}
            <span className="text-sm font-semibold -mt-1 text-whiteText">
              Ethiopia
            </span>
          </p>
        </div>
        <div className="hidden lgl:inline-flex h-10 rounded-md flex-grow relative">
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
            <div>
              <ul
                className="absolute w-56 h-80 top-10 left-0 overflow-y-scroll overflow-x-hidden bg-white border-[1px] border-amazon_blue text-black p-2 flex flex-col gap-1 z-50"
              >
                            <p
              className="text-gray-800 hover:bg-gray-200 rounded-md px-2 py-1 cursor-pointer"
              // onClick={() => ("")}
            >
              {selectedCategory ? "All" : ""}
            </p>
                {categories.map((item: Category) => (
                  <li
                    onClick={() => {
                      setSelectedCategory(item.name);
                      setShowAll(false);
                    }}
                    className="text-sm tracking-wide font-titleFont border-b-[1px] border-b-transparent hover:border-b-amazon_blue cursor-pointer duration-200"
                    key={item.id}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
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
          <div className="flex items-center p-2 border border-transparent hover:border-white cursor-pointer duration-300 h-[70%] gap-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            >
            <div className="text-xs text-gray-100 flex flex-col justify-between">
              <p className="text-white font-bold">{userInfo.username}</p>
              <p>{userInfo.email}</p>
            </div>
              <MdArrowDropDown />
              {isHovered && (
                <div className="absolute top-16 bg-white p-4 rounded shadow-md text-sm text-amazon_blue font-titleFont">
                  <ul>
                    <li className="hover:text-yellow-500 cursor-pointer duration-200">Marked and Favorites</li>
                    <li className="hover:text-yellow-500 cursor-pointer duration-200">Logout</li>
                  </ul>  
                </div>
              )}
          </div>
        ) : (
        <Link to="/sign-in">
          <div className="flex flex-col items-start justify-center p-2 hover:border-white cursor-pointer duration-300 border border-transparent">
            <p className="text-xs text-lightText font-light">
              Hello, sign in
            </p>
            <p className="hidden md:inline-flex text-sm font-semibold -mt-1 text-whiteText">
              Accounts & Lists{" "}
              <span>
              </span>
            </p>
          </div>
        </Link>
        )}

        {userInfo?.email ? (
          <Link
            to={"/favorite"}
            className="p-2 text-xs text-gray-100 flex flex-col justify-center px-2 border border-transparent hover:border-white cursor-pointer duration-300 h-[70%] relative"
          >
          <p>Marked</p>
          <p className="text-white font-bold">& Favorite</p>
          {/* {favoriteData.length > 0 && (
            <span className="absolute right-2 top-2 w-4 h-4 border-[1px] border-gray-400 flex items-center justify-center text-xs text-amazon_yellow">
              {favoriteData.length}
            </span>
          )} */}
          </Link>
        ): (
          <>
          <div className="hidden mdl:flex flex-col items-start justify-center headerHover p-2 hover:border-white cursor-pointer duration-300 border border-transparent">
            <p className="text-xs text-lightText font-light">Returns</p>
            <p className="text-sm font-semibold -mt-1 text-whiteText">& Orders</p>
          </div>
          </>
        )}

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
    </div>
  );
};

export default Header;

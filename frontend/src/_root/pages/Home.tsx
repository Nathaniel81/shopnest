// import { useState, useEffect } from "react";
import Banner from "../../components/shared/Banner";
import Products from "../../components/shared/Products";
import { useGetProducts } from "../../lib/react-query/queries";


const Home = () => {
  const { 
    data: products, 
    // isError, 
    // isLoading 
  } = useGetProducts();

  return (
    <main>
      <div className="max-w-screen-2xl mx-auto">
        <Banner />
        <div className="relative md:-mt020 lgl:-mt-32 xl:-mt-60 z-20 mb-10">
          <Products productData={products} />
        </div>
      </div>
    </main>
  );
};

export default Home;

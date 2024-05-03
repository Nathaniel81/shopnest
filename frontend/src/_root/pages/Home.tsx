import { useState, useEffect } from "react";
import Banner from "../../components/shared/Banner";
import Products from "../../components/shared/Products";

const Home = () => {
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("https://fakestoreapiserver.reactbd.com/tech");
      const data = await res.json();
      setProductData(data);
    };

    fetchProducts();
  }, []);

  return (
    <main>
      <div className="max-w-screen-2xl mx-auto">
        <Banner />
        <div className="relative md:-mt020 lgl:-mt-32 xl:-mt-60 z-20 mb-10">
          <Products productData={productData} />
        </div>
      </div>
    </main>
  );
};

export default Home;

import Banner from "../../components/shared/Banner";
import Products from "../../components/shared/Products";
import { useGetProducts } from "../../lib/react-query/queries";
import { BeatLoader } from "react-spinners";


const Home = () => {
  const { 
    data: products, 
    isRefetching, 
    isLoading 
  } = useGetProducts();

  return (
    <main>
      <div className="max-w-screen-2xl mx-auto">
        <Banner />
        <div className="relative md:-mt-20 lgl:-mt-32 xl:-mt-60 z-20 mb-10">
        {isLoading || isRefetching ? (
        <div className="w-full flex flex-col gap-6 items-center justify-center py-20">
          <BeatLoader color="#131921" size={40} />
        </div>
      ) : (
          <Products productData={products} />
      )}
        </div>
      </div>
    </main>
  );
};

export default Home;

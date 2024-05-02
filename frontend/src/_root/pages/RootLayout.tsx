import { Outlet } from "react-router-dom";
import Header from "../../components/shared/header/Header";
import BottomHeader from "../../components/shared/header/BottomHeader";
import Footer from "../../components/shared/Footer";

const RootLayout = () => {
  return (
    <>
      <Header />
      <BottomHeader />
      <Outlet />
      <Footer />
    </>
  );
};

export default RootLayout;

import { headerIcons } from "../../constants";


const Footer = () => {
  const logo = headerIcons[1].imgURL;

  return (
    <div className="w-full h-20 bg-amazon_light text-gray-300 flex items-center justify-center gap-4 p-20 mt-10">
      <img className="w-24" src={logo} alt="logo" />
      <p className="text-sm -mt-4">
        All rights reserved{" "}
        <a
          className="hover:text-white hover:underline decoration-[1px] cursor-pointer duration-300"
          href="https://shopnest-eykw.onrender.com"
          target="_blank"
        >
          @shopnest-eykw.onrender.com
        </a>
      </p>
    </div>
  );
};

export default Footer;

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { sliderImages } from "../../constants";


export default function Banner() {
  return ( 
    <>
      <div className='relative lg:h-screen'>
        <Carousel 
          showArrows={false} 
          autoPlay={true} 
          interval={3000}
          infiniteLoop={true} 
          showThumbs={false}
          showStatus={false}
          showIndicators={false}
        >
          {sliderImages.map((image, index) => (
            <div key={index}>
              <img src={image.imgURL} alt={`sliderImg_${index}`} />
            </div>
          ))}
        </Carousel>
        <div className="w-full h-40 bg-gradient-to-t from-gray-100 to-transparent absolute bottom-0 z-20"></div>
      </div>
    </>
  );
}

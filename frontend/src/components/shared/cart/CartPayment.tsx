import { SiMediamarkt } from "react-icons/si";
import FormattedPrice from "../../FormattedPrice";
import { 
	useDispatch, 
	useSelector 
} from "react-redux";
import { StateProps, StoreProduct } from "../../../types";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { toast } from "react-toastify";
import QueryString from 'query-string';
import { resetUser, resetCart } from "../../../redux/slices/appSlice";


const CartPayment = () => {
  const { productData, userInfo } = useSelector(
    (state: StateProps) => state.app
  );
  const location = useLocation();
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    let amt = 0;
    productData.map((item: StoreProduct) => {
      amt += item.price * item.quantity;
      return;
    });
    setTotalAmount(amt);
  }, [productData]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const values = QueryString.parse(location.search);

            if (values.success) {
              const response = await axios.post(
                `/api/stripe/confirm_payment/`,
                {
                    session_id: values.session_id,
                    items: productData
                }
              );
              if (response.data.status === 'Payment was successful and order was created') {
                toast.success("Order placed! You will receive an email confirmation.");
                dispatch(resetCart());
                navigate('/');
              } else {
                  toast.error("Error confirming payment");
              }
            }

            if (values.canceled) {
                toast.info("Order canceled -- continue to shop around and checkout when you're ready");
                navigate('/');
            }
          //eslint-disable-next-line
        } catch (error: any) {
            console.error(error.response.data);
            toast.error("Error confirming payment");
        }
    };

    const values = QueryString.parse(location.search);
    if (values.success || values.canceled) {
        fetchData();
    }
    //eslint-disable-next-line
  }, [location.search]);


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post<{ url: string }>(`/api/stripe/`, {items: productData})
  
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      toast.error('Login Required');
      dispatch(resetUser());
    }
  };

  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <span className="bg-green-600 rounded-full p-1 h-6 w-6 text-sm text-white flex items-center justify-center mt-1">
          <SiMediamarkt />
        </span>
        <p className="text-sm">
          Your order qualifies for FREE Shipping by Choosing this option at
          checkout. See details....
        </p>
      </div>
      <p className="flex items-center justify-between px-2 font-semibold">
        Total:{" "}
        <span className="font-bold text-xl">
          <FormattedPrice amount={totalAmount} />
        </span>
      </p>
      {userInfo ? (
        <form
          className="flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          <button 
            className="w-full h-10 text-sm font-semibold bg-amazon_blue text-white rounded-lg hover:bg-amazon_yellow hover:text-black duration-300" 
            type='submit'>
              Checkout
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center">
          <button className="w-full h-10 text-sm font-semibold bg-amazon_blue bg-opacity-50 text-white rounded-lg cursor-not-allowed">
            Proceed to Buy
          </button>
          <p className="text-xs mt-1 text-red-500 font-semibold animate-bounce">
            Please login to continue
          </p>
        </div>
      )}
    </div>
  );
};

export default CartPayment;

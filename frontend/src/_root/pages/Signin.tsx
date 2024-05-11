import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import * as z from "zod";
import { SigninValidation } from "../../lib/validation";
import { addUser } from "../../redux/slices/appSlice";


const Signin = () => {
  const form = useForm<z.infer<typeof SigninValidation>>({
      resolver: zodResolver(SigninValidation),
      defaultValues: {
        email: "",
        password: "",
      },
    });
  const { formState: { errors }} = form;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const handleSubmit = form.handleSubmit(async (values) => {
    setLoading(true);
    form.reset();
    try {
      const config = {
        headers: {
          'Content-type': 'application/json'
        }
      }
      console.log(values);
      const { data } = await axios.post(`/api/user/login/`, values, config);
      dispatch(addUser(data));
      navigate('/');
      //eslint-disable-next-line
    } catch (error: any) {
      console.log(error)
      if (error.response) {
        if (error.response.status === 401) {
          toast.error('Incorrect email or password. Please try again.');
        } else if (error.response.status === 429) {
          toast.error('Too many login attempts. Please try again later.');
        } else {
          toast.error('An error occurred. Please try again later.');
        }
      } else {
        toast.error('An error occurred. Please try again later.');
      }
    }
    setLoading(false);
  });
  


  return (
    <div className="w-full">
      <div className="w-full bg-gray-100 pb-10">     
          <form 
            onSubmit={(e) => handleSubmit(e)}
            className="w-[350px] mx-auto flex flex-col items-center">
            <Link to="/">
              {/* <img className="w-32" src={darkLogo} alt="darkLogo" /> */}
            </Link>
            <div className="mt-3 w-full border border-zinc-200 p-6">
              <h2 className="font-titleFont text-3xl font-medium mb-4">
                Sign in
              </h2>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium">
                    Email
                  </p>
                  <input
                    {...form.register("email")}
                    className="w-full lowercase py-1 border border-zinc-400 px-2 text-base rounded-sm outline-none focus-within:border-[#e77600] focus-within:shadow-amazonInput duration-100"
                    type="email"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-xs font-semibold tracking-wide flex items-center gap-2 -mt-1.5">
                      <span className="italic font-titleFont font-extrabold text-base">
                        !
                      </span>
                      {errors.email.message}
                    </p>
                  )}
                 
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium">Password</p>
                  <input
                    {...form.register("password")}
                    className="w-full lowercase py-1 border border-zinc-400 px-2 text-base rounded-sm outline-none focus-within:border-[#e77600] focus-within:shadow-amazonInput duration-100"
                    type="password"
                  />
                  {errors.password && (
                    <p className="text-red-600 text-xs font-semibold tracking-wide flex items-center gap-2 -mt-1.5">
                      <span className="italic font-titleFont font-extrabold text-base">
                        !
                      </span>
                      {errors.password.message}
                    </p>
                  )}
                 
                </div>
                <button
                  className="w-full py-1.5 text-sm font-normal rounded-sm bg-gradient-to-t from-[#f7dfa5] to-[#f0c14b] hover:bg-gradient-to-b border border-zinc-400 active:border-yellow-800 active:shadow-amazonInput"
                >
                  {loading ? (
                    <div className="flex items-center justify-center py-1">
                      <BeatLoader color="#131921" size={9} />
                    </div>
                  ):
                    <>Continue</>}
                </button>
               
              </div>
              <p className="text-xs text-black leading-4 mt-4">
                By Continuing, you agree to Amazon's{" "}
                <span className="text-blue-600">Conditions of Use </span>and{" "}
                <span className="text-blue-600">Privace Notice.</span>
              </p>
              <p className="text-xs text-gray-600 mt-4 cursor-pointer group">
                {/* <ArrowRightIcon />{" "} */}
                <span className="text-blue-600 group-hover:text-orange-700 group-hover:underline underline-offset-1">
                  Need help?
                </span>
              </p>
            </div>
            <p className="w-full text-xs text-gray-600 mt-4 flex items-center">
              <span className="w-1/3 h-[1px] bg-zinc-400 inline-flex"></span>
              <span className="w-1/3 text-center">New to Amazon?</span>
              <span className="w-1/3 h-[1px] bg-zinc-400 inline-flex"></span>
            </p>
            <Link className="w-full" to="/sign-up">
              <button className="w-full py-1.5 mt-4 text-sm font-normal rounded-sm bg-gradient-to-t from-slate-200 to-slate-100 hover:bg-gradient-to-b border border-zinc-400 active:border-yellow-800 active:shadow-amazonInput">
                Create your Amazon account
              </button>
            </Link>
          </form>
      
      </div>
      <div className="w-full bg-gradient-to-t from-white via-white to-zinc-200 flex flex-col gap-4 justify-center items-center py-10">
        <div className="flex items-center gap-6">
          <p className="text-xs text-blue-600 hover:text-orange-600 hover:underline underline-offset-1 cursor-pointer duration-100">
            Conditions of Use
          </p>
          <p className="text-xs text-blue-600 hover:text-orange-600 hover:underline underline-offset-1 cursor-pointer duration-100">
            Privacy Notice
          </p>
          <p className="text-xs text-blue-600 hover:text-orange-600 hover:underline underline-offset-1 cursor-pointer duration-100">
            Privacy Notice
          </p>
        </div>
        <p className="text-xs text-gray-600">
          © 1996-2024, shopnest.com, Inc. or its affiliates
        </p>
      </div>
    </div>
  );
};

export default Signin;

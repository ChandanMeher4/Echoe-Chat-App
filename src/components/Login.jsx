import React, { useState } from "react";
import { FaSignInAlt } from "react-icons/fa";
import {signInWithEmailAndPassword} from 'firebase/auth'
import {auth} from '../firebase/firebase'

const Login = ({isLoggedin, setIsLoggedin}) => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAuth = async () => {
    setIsLoading(true)
    try {
      await signInWithEmailAndPassword(auth, userData?.email, userData?.password)
    } catch (err) {
      console.log("login error:", err);
      alert(err.message)
    }finally{
      setIsLoading(false)
    }
  };
  return (
    <section className="flex flex-col justify-center items-center h-screen bg-slate-900 background_image">
      <div
        className="w-84 flex flex-col justify-center items-center 
                   rounded-2xl bg-slate-800/60 p-6 backdrop-blur-lg 
                   border border-slate-700/50 shadow-2xl shadow-black/30"
      >
        <div className="mb-8 text-center">
          <h1 className="text-[28px] font-bold text-slate-100">Welcome Back</h1>
          <p className="text-sm text-slate-400 font-light">
            Sign in to continue to your account
          </p>
        </div>

        <div className="w-full space-y-4">
          <input
            type="email"
            name="email"
            onChange={handleChange}
            className="w-full p-2.5 rounded-md bg-slate-900/70 text-slate-200 placeholder:text-slate-500 
                       border border-slate-700 shadow-inner shadow-black/20 outline-none 
                       focus:border-sky-400 focus:ring-2 focus:ring-sky-400/50 
                       transition-all duration-300"
            placeholder="Email"
          />
          <input
            type="password"
            name="password"
            onChange={handleChange}
            className="w-full p-2.5 rounded-md bg-slate-900/70 text-slate-200 placeholder:text-slate-500 
                       border border-slate-700 shadow-inner shadow-black/20 outline-none 
                       focus:border-sky-400 focus:ring-2 focus:ring-sky-400/50 
                       transition-all duration-300"
            placeholder="Password"
          />
        </div>

        <div className="w-full mt-6">
          <button
            onClick={handleAuth}
            className="w-full p-2.5 font-bold rounded-md cursor-pointer 
                       bg-linear-to-r from-sky-400 to-sky-500 text-slate-900 
                       shadow-lg shadow-sky-500/20 
                       hover:shadow-xl hover:shadow-sky-500/30 hover:scale-[1.02] 
                       transition-all duration-300 ease-in-out"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span>processing...</span>
                <FaSignInAlt className="inline ml-2" />
              </>
            ) : (
              <>
                <span>Sign In</span>
                <FaSignInAlt className="inline ml-2" />
              </>
            )}
          </button>
        </div>

        <div className="mt-6 text-center text-slate-400 text-sm">
          <button
            className="cursor-pointer hover:text-sky-400 transition-colors duration-200"
            onClick={() => {
              setIsLoggedin(!isLoggedin);
            }}
          >
            Don't have an account? Sign Up
          </button>
        </div>
      </div>
    </section>
  );
};

export default Login;

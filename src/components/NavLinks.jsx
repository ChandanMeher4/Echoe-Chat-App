import React from "react";
import logo from "../assets/logo.png";
import {signOut} from 'firebase/auth'
import {auth} from '../firebase/firebase'
import {
  RiArrowDownSFill,
  RiBardLine,
  RiChatHeartLine,
  RiFile4Line,
  RiFolderUserLine,
  RiNotificationLine,
  RiShutDownLine,
} from "react-icons/ri";

const NavLinks = () => {
  const handleLogout = async () =>{
    try{
      await signOut(auth)
    }
    catch(error){
      console.log(error)
    }
  }
  return (
    <section
      className="sticky lg:static top-0 z-50
                 h-[7vh] lg:h-screen w-full lg:w-24
                 bg-slate-800/80 lg:bg-slate-800 backdrop-blur-md
                 border-b lg:border-r border-slate-700/50"
    >
      <main className="flex lg:flex-col items-center justify-between w-full h-full lg:py-4 px-4">
        <div className="flex items-center justify-center p-2 lg:border-b border-slate-700/50 lg:pb-6">
          <span className="flex items-center justify-center rounded-lg p-1">
            <img
              src={logo}
              className="w-9 h-9 object-contain"
              alt="Echoe Logo"
            />
          </span>
        </div>

        <ul className="flex flex-row items-center justify-around lg:justify-center lg:flex-col lg:space-y-4 lg:grow lg:mt-6">
          <li>
            <button
              className="flex items-center justify-center w-12 h-12 lg:w-16 lg:h-14 rounded-lg
                               text-sky-400 
                               bg-linear-to-r from-sky-500/10 to-indigo-500/10
                               border-b-2 lg:border-b-0 lg:border-l-2 border-sky-400
                               transition-all duration-200"
            >
              <RiChatHeartLine className="w-6 h-6 lg:w-7 lg:h-7" />
            </button>
          </li>

          <li>
            <button
              className="flex items-center justify-center w-12 h-12 lg:w-16 lg:h-14 rounded-lg
                               text-slate-400
                               hover:text-sky-400 hover:bg-slate-700/50
                               transition-all duration-200"
            >
              <RiFolderUserLine className="w-6 h-6 lg:w-7 lg:h-7" />
            </button>
          </li>

          <li>
            <button
              className="flex items-center justify-center w-12 h-12 lg:w-16 lg:h-14 rounded-lg
                               text-slate-400
                               hover:text-sky-400 hover:bg-slate-700/50
                               transition-all duration-200"
            >
              <RiNotificationLine className="w-6 h-6 lg:w-7 lg:h-7" />
            </button>
          </li>

          <li className="hidden lg:block">
            <button
              className="flex items-center justify-center w-12 h-12 lg:w-16 lg:h-14 rounded-lg
                               text-slate-400
                               hover:text-sky-400 hover:bg-slate-700/50
                               transition-all duration-200"
            >
              <RiFile4Line className="w-6 h-6 lg:w-7 lg:h-7" />
            </button>
          </li>

          <li className="hidden lg:block">
            <button
              className="flex items-center justify-center w-12 h-12 lg:w-16 lg:h-14 rounded-lg
                               text-slate-400
                               hover:text-sky-400 hover:bg-slate-700/50
                               transition-all duration-200"
            >
              <RiBardLine className="w-6 h-6 lg:w-7 lg:h-7" />
            </button>
          </li>
        </ul>

        <button className="lg:hidden flex items-center justify-center w-12 h-12 rounded-lg text-slate-400">
          <RiArrowDownSFill className="w-6 h-6" />
        </button>

        <div className="hidden lg:block">
          <button
            className="flex items-center justify-center w-16 h-14 rounded-lg
                             text-slate-400
                             hover:text-red-500 hover:bg-red-500/10
                             transition-all duration-200"
            onClick={handleLogout}
          >
            <RiShutDownLine className="w-6 h-6" />
          </button>
        </div>
      </main>
    </section>
  );
};

export default NavLinks;

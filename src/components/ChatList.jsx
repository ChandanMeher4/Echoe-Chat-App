import React, { useState, useEffect, useMemo } from "react";
import defaultAvatar from "../assets/default.jpg";
import { RiMore2Fill } from "react-icons/ri";
import SearchModel from "./SearchModel";
import { formatTimestamp } from "../utils/formatTimestamp";
import { auth, db, listenForChats } from "../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";

const ChatList = ({setSelectedUser}) => {
  const [chats, SetChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState("chat2"); 
  const [user, setUser] = useState(null)

  useEffect(()=>{
    if (!auth?.currentUser?.uid) {
      return
    }
    const userDocRef = doc(db, 'user', auth?.currentUser?.uid)
    const unsubscribe = onSnapshot(userDocRef, (doc)=>{
      setUser(doc.data())
    })
    return unsubscribe
  }, [auth.currentUser])

  useEffect(() => {
    if(!auth?.currentUser) return;
    const unsubscribe = listenForChats(SetChats)

    return ()=>{
      unsubscribe()
    }
  }, [auth.currentUser]);

  const sortedChats = useMemo(() => {
    return [...chats].sort((a, b) => {
      const aTimeStamp = a?.lastMessageTimestamp?.seconds + a?.lastMessageTimestamp?.nanoseconds / 1e9;
      const bTimeStamp = b?.lastMessageTimestamp?.seconds + b?.lastMessageTimestamp?.nanoseconds / 1e9;

      return bTimeStamp - aTimeStamp;
    });
  }, [chats]);

  const startChat = (user) =>{
    setSelectedUser(user)
  }

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b; /* slate-800 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155; /* slate-700 */
        }
      `}</style>

      <section
        className="relative lg:flex flex-col items-start 
                   bg-slate-800 h-screen w-full md:w-[360px] lg:w-[400px]
                   border-r border-slate-700/50"
      >
        <header
          className="flex items-center justify-between w-full p-4 sticky top-0 z-10
                     bg-slate-800/70 backdrop-blur-md
                     border-b border-slate-700/50"
        >
          <main className="flex items-center gap-3">
            <img
              src={user?.image || defaultAvatar}
              className="w-11 h-11 object-cover rounded-full ring-2 ring-slate-700"
              alt="User Avatar"
            />
            <span>
              
              <h3 className="p-0 font-semibold text-slate-200 md:text-[17px]">
                {user?.fullName || 'Echoe User'}
              </h3>
              <p className="p-0 font-light text-slate-400 text-[15px] ">
                @{user?.username || "echoe"}
              </p>
            </span>
          </main>
          
          <button
            className="w-10 h-10 p-2 flex items-center justify-center rounded-lg
                       bg-slate-700/50 text-slate-400
                       hover:bg-slate-600/50 hover:text-sky-400
                       transition-colors duration-200"
          >
            <RiMore2Fill className="w-6 h-6" />
          </button>
        </header>

        
        <div className="w-full mt-2.5 px-5">
          <header className="flex items-center justify-between py-2">
            <h3 className="text-[18px] font-bold text-slate-200">
              Messages{" "}
              <span className="font-medium text-slate-400">
                ({chats?.length || 0})
              </span>
            </h3>
            
            <SearchModel startChat={startChat}/>
          </header>
        </div>

        
        <main className="flex flex-col w-full h-full overflow-y-auto custom-scrollbar">
          {sortedChats?.map((chat) => (
            <React.Fragment key={chat.id}>
              {chat?.users
                ?.filter((user) => user.email !== auth?.currentUser?.email)
                ?.map((user) => (
                  <button
                    key={user.uid}
                    onClick={() => setActiveChatId(chat.id)}
                    
                    className={`flex items-start justify-between w-full px-5 py-3 
                                border-b border-slate-700/50
                                border-l-4
                                ${
                                  activeChatId === chat.id
                                    ? "border-sky-400 bg-linear-to-r from-sky-500/10 to-transparent"
                                    : "border-transparent hover:bg-slate-700/50"
                                }
                                transition-all duration-200 group`}
                  >
                    <div onClick={()=>startChat(user)} className="flex items-start gap-3">
                      
                      <img
                        src={user?.image || defaultAvatar}
                        className="h-11 w-11 rounded-full object-cover 
                                   ring-2 ring-slate-700"
                        alt={`${user?.fullName} avatar`}
                      />
                      <span className="mt-0.5">
                        
                        <h2 className="p-0 font-semibold text-slate-200 text-left text-[16px]">
                          {user?.fullName || "Echoe User"}
                        </h2>
                        <p className="p-0 font-light text-slate-400 text-left text-[14px] truncate w-48">
                          {chat?.lastMessage}
                        </p>
                      </span>
                    </div>
                    
                    <p className="p-0 font-medium text-slate-500 text-right text-[12px] pt-1 whitespace-nowrap">
                      {formatTimestamp(chat?.lastMessageTimestamp)}
                    </p>
                  </button>
                ))}
            </React.Fragment>
          ))}
        </main>
      </section>
    </>
  );
};

export default ChatList;
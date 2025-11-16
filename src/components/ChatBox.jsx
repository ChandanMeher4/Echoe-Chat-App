import { useEffect, useState, useMemo, useRef } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import defaultAvatar from "../assets/default.jpg";
import { messageData } from "../data/messageData";
import { formatTimestamp } from "../utils/formatTimestamp";
import {auth, listenForChats, listenForMessages, sendMessage} from "../firebase/firebase"
import logo from '../assets/logo.png'

const ChatBox = ({selectedUser}) => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  
  const scrollRef = useRef(null);

  const chatId = auth?.currentUser?.uid < selectedUser?.uid ? `${auth?.currentUser?.uid} - ${selectedUser?.uid}` : `${selectedUser?.uid} - ${auth?.currentUser?.uid}`
  const user1 = auth?.currentUser
  const user2 = selectedUser
  const senderEmail = auth?.currentUser.email;

  useEffect(() => {
    if (!chatId) return;
    const unsubscribe = listenForMessages(chatId, setMessages)
    return unsubscribe
  }, [chatId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      const aTimeStamp = a?.timestamp?.seconds + a?.timestamp?.nanoseconds / 1e9;
      const bTimeStamp = b?.timestamp?.seconds + b?.timestamp?.nanoseconds / 1e9;

      return aTimeStamp - bTimeStamp;
    });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    const newMessage = {
      sender: senderEmail,
      text: messageText,
      timestamp: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: 0,
      },
    };

    sendMessage(messageText, chatId, user1?.uid, user2?.uid)
    setMessages((prevMessage) => [...prevMessage, newMessage]);
    setMessageText("");
  };

  return (
    <>
    {selectedUser? <section className="flex flex-col h-screen w-full bg-slate-900">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-slate-700/50 p-4 bg-slate-800/70 backdrop-blur-md sticky top-0 z-10">
        <img
          src={selectedUser?.image || defaultAvatar}
          className="w-11 h-11 object-cover rounded-full ring-2 ring-slate-700"
          alt="avatar"
        />
        <div>
          <h3 className="font-semibold text-slate-200 text-lg">{selectedUser?.fullName || 'Echoe User'}</h3>
          <p className="font-light text-slate-400 text-sm">@{selectedUser?.username || 'Echoe'}</p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 custom-scrollbar" ref={scrollRef}>
        {sortedMessages?.map((msg, index) => (
          <div key={index}>
            {msg?.sender === senderEmail ? (
              // Sent Message
              <div className="flex justify-end">
                <div className="max-w-[70%]">
                  <div className="bg-sky-500 text-white p-4 rounded-lg shadow-sm">
                    <p className="text-[16px]">{msg.text}</p>
                  </div>
                  <p className="text-slate-500 text-xs mt-2 text-right">
                    {formatTimestamp(msg.timestamp)}
                  </p>
                </div>
              </div>
            ) : (
              // Received Message
              <div className="flex items-start gap-3">
                <img
                  src={selectedUser?.image || defaultAvatar}
                  className="h-11 w-11 object-cover rounded-full ring-2 ring-slate-700"
                  alt="avatar"
                />
                <div className="max-w-[70%]">
                  <div className="bg-slate-700 text-slate-200 p-4 rounded-lg shadow-sm">
                    <p className="text-[16px]">{msg.text}</p>
                  </div>
                  <p className="text-slate-500 text-xs mt-2">
                    {formatTimestamp(msg.timestamp)}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-slate-800/70 backdrop-blur-md border-t border-slate-700/50">
        <form
          className="flex items-center relative bg-slate-700 h-[45px] px-2 rounded-lg shadow-sm"
          onSubmit={handleSendMessage}
        >
          <input
            type="text"
            className="h-full text-slate-200 outline-none text-[16px] pl-3 pr-[50px] rounded-lg w-full bg-transparent placeholder:text-slate-500"
            placeholder="Type your message..."
            onChange={(e) => setMessageText(e.target.value)}
            value={messageText}
          />
          <button
            type="submit"
            className="absolute right-4 flex items-center justify-center p-2 rounded-full bg-sky-500 hover:bg-sky-600 transition"
          >
            <RiSendPlaneFill className="text-white" />
          </button>
        </form>
      </div>
    </section> : <section className="h-screen w-full bg-slate-900">
      <div className="flex flex-col justify-center items-center h-screen">
        <img src={logo} alt="" width={100}/>
        <h1 className="font-semibold text-slate-200 text-lg">Welcome To Echoe</h1>
        <p className="font-light text-slate-400 text-sm">chat that resonates...</p>
      </div>
      </section>}
    </>
    
  );
};

export default ChatBox;
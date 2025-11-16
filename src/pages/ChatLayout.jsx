import React, { useState } from "react";
import ChatList from "../components/ChatList";
import ChatBox from "../components/ChatBox";

const ChatLayout = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="flex w-full h-screen">
      <div
        className={`
          shrink-0
          ${selectedUser ? "hidden" : "flex"} lg:flex
        `}
      >
        <ChatList setSelectedUser={setSelectedUser} />
      </div>
      <div
        className={`
          w-full flex-1
          ${selectedUser ? "flex" : "hidden"} lg:flex
        `}
      >
        <ChatBox
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </div>
    </div>
  );
};

export default ChatLayout;

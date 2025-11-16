import React, { useState, useEffect } from "react";
import NavLinks from "./components/NavLinks";
import Login from "./components/Login";
import Register from "./components/Register";
import ChatList from "./components/ChatList";
import ChatBox from "./components/ChatBox";

import { auth } from "./firebase/firebase";

const App = () => {
  const [isLoggedin, setIsLoggedin] = useState(true);
  const [user, setuser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setuser(currentUser);
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setuser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? (
        <div className="flex flex-col lg:flex-row items-start w-full">
          <NavLinks />
          <ChatList setSelectedUser={setSelectedUser}/>
          <ChatBox selectedUser={selectedUser}/>
        </div>
      ) : (
        <div>
          {isLoggedin ? <Login isLoggedin={isLoggedin} setIsLoggedin={setIsLoggedin}/> : <Register isLoggedin={isLoggedin} setIsLoggedin={setIsLoggedin}/>}
        </div>
      )}
    </div>
  );
};

export default App;

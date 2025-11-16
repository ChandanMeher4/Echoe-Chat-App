import React, { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';

const AuthPage = () => {
  const [isLoggedin, setIsLoggedin] = useState(true);

  return (
    <div className="w-full">
      {isLoggedin ? (
        <Login isLoggedin={isLoggedin} setIsLoggedin={setIsLoggedin} />
      ) : (
        <Register isLoggedin={isLoggedin} setIsLoggedin={setIsLoggedin} />
      )}
    </div>
  );
};

export default AuthPage;
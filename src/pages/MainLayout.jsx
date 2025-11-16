import React from 'react';
import { Outlet } from 'react-router-dom';
import NavLinks from '../components/NavLinks';

const MainLayout = () => {
  return (
    <div className="flex flex-col lg:flex-row items-start w-full">
      <NavLinks />
      <Outlet /> 
    </div>
  );
};

export default MainLayout;
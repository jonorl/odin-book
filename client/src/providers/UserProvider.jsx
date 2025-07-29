// import { useState } from 'react';
import { UserContext } from '../contexts/UserContext';

export const UserProvider = ({ children }) => {

  return (
    <UserContext.Provider value={{ }}>
      {children}
    </UserContext.Provider>
  );
};
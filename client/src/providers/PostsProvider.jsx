// import { useState } from 'react';
import { PostsContext } from '../contexts/PostsContext';

export const PostsProvider = ({ children }) => {

  return (
    <PostsContext.Provider value={{ }}>
      {children}
    </PostsContext.Provider>
  );
};
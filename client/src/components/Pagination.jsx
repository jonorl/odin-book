import { useEffect } from 'react';
import { usePost } from '../hooks/usePosts'

export const PaginationButtons = () => {
  const { currentPage, setCurrentPage, postChangePage } = usePost();

  return (
    <div className="flex justify-center p-4">
      {currentPage > 1 && <button className='mx-1 px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300'
        onClick={() => {setCurrentPage(currentPage - 1); () => postChangePage(currentPage-1); window.location.reload()}}>&lt;</button>}
      <button
        key={currentPage}
        className={`mx-1 px-3 py-1 rounded-md bg-blue-500 text-white`}
      >
        {currentPage}
      </button>{useEffect(() => { console.log("currentPage", currentPage), [currentPage] })}
      <button className='mx-1 px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300' 
      onClick={() => {const newPage = currentPage + 1; setCurrentPage(newPage); postChangePage(newPage);/*  window.location.reload() */}}>&gt;</button>
    </div>
  );
};

export default PaginationButtons;
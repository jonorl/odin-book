import { useEffect } from 'react';
import { usePost } from '../hooks/usePosts'

export const PaginationButtons = () => {
  const { currentPage, setCurrentPage } = usePost();

  return (
    <div className="flex justify-center p-4">
      {currentPage > 1 && <button className='mx-1 px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300'
        onClick={() => setCurrentPage(currentPage - 1)}>&lt;</button>}
      <button
        key={currentPage}
        className={`mx-1 px-3 py-1 rounded-md bg-blue-500 text-white`}
      >
        {currentPage}
      </button>{useEffect(() => { console.log("currentPage", currentPage), [currentPage] })}
      <button className='mx-1 px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300' 
      onClick={() => setCurrentPage(currentPage + 1)}>&gt;</button>
    </div>
  );
};

export default PaginationButtons;
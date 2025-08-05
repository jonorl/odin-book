import { useUser } from '../hooks/UseUser'

export const PaginationButtons = () => {
  const { currentPage, setCurrentPage, postChangePage } = useUser();

  return (
    <div className="flex justify-center p-4">
      {currentPage > 1 && <button className='mx-1 px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300'
        onClick={() => { const newPage = currentPage - 1; setCurrentPage(newPage) }}>&lt;</button>}
      <button
        key={currentPage}
        className={`mx-1 px-3 py-1 rounded-md bg-blue-500 text-white`}
      >
        {currentPage}
      </button>
      <button className='mx-1 px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300'
        onClick={() => { const newPage = currentPage + 1; setCurrentPage(parseInt(newPage)) }}>&gt;</button>
    </div>
  );
};

export default PaginationButtons;
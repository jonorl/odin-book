import { useTheme } from '../hooks/useTheme';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, postId }) => {
    const { darkMode } = useTheme();

    if (!isOpen) return null;

    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${darkMode ? "bg-black text-white border-gray-800" : "bg-white text-black border-gray-200"
        } bg-opacity-50 backdrop-blur-sm`}>
        <div className={`${darkMode ? "bg-black text-white border-gray-800" : "bg-white text-black border-gray-200"
          } text-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl border `}>
          <h2 className="text-xl font-semibold mb-4">Delete Post</h2>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} mb-6`}>Are you sure you want to delete this post? This action cannot be undone.</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={(e) => { e.stopPropagation(); onClose() }}
              className={`px-4 py-2 ${darkMode ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-black"} transition-colors rounded-full`}
            >
              Cancel
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Explicitly stop propagation
                onConfirm(postId);
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default ConfirmDeleteModal;
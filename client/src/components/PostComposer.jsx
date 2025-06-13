import { useState } from 'react';

const PostComposer = ({ darkMode, HOST }) => {
    const [postText, setPostText] = useState('');

    const postMessage = async () => {
        try {
            const res = await fetch(`${HOST}/api/v1/newPost/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postText }),
            });
            const data = await res.json();
            window.location.reload()
            return data
        } catch (err) {
            console.error("Failed to post new message:", err);
        }
    }

    return (
        <div className={`border-b p-4 ${darkMode
            ? 'border-gray-800 bg-black'
            : 'border-gray-200 bg-white'
            }`}>
            <div className="flex space-x-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    👤
                </div>
                <div className="flex-1">
                    <textarea
                        className={`w-full text-xl resize-none focus:outline-none border-none ${darkMode
                            ? 'bg-black text-white placeholder-gray-500'
                            : 'bg-white text-black placeholder-gray-500'
                            }`}
                        placeholder="What's happening?"
                        rows={3}
                        name="text"
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                    />
                    <div className="flex justify-between items-center mt-3">
                        <div className="flex space-x-4 text-blue-500">
                            <button className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-blue-50'
                                }`}>📷</button>
                        </div>
                        <button
                            className={`px-6 py-2 rounded-full font-bold ${postText.trim()
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-blue-300 text-white cursor-not-allowed'
                                }`}
                            disabled={!postText.trim()}
                            onClick={postMessage}
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostComposer
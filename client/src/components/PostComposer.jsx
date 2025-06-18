import { useState } from 'react';
import { Paperclip } from 'lucide-react'

const PostComposer = ({ darkMode, HOST, user }) => {
    const [postText, setPostText] = useState('');
    const [imageFile, setImageFile] = useState(null);

    const postMessage = async () => {
        const formData = new FormData();
        if (imageFile) {
            formData.append('imageFile', imageFile); // 'imageFile' is your actual File object from state
        }
        formData.append('user[id]', user.id);
        formData.append('postText', JSON.stringify(postText));
        try {
            const res = await fetch(`${HOST}/api/v1/newPost/`, {
                method: "POST",
                body: formData,
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
                    {/* <div className="flex justify-between items-center mt-3">
                        <div className="flex space-x-4 text-blue-500">
                            <button className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-blue-50'
                                }`}>📷</button>
                            </div> */}

                    <>
                        <div className="relative flex items-center">
                            <input
                                type="file"
                                accept="image/*"
                                id="file-upload"
                                name="imageFile"
                                onChange={(e) => setImageFile(e.target.files[0])}
                                className="hidden"
                            />
                            <label htmlFor="file-upload" className="flex cursor-pointer items-center">
                                <Paperclip className="text-gray-300 hover:text-white w-5 h-5" />
                                {imageFile && (
                                    <span className="text-sm text-gray-400 ml-2 truncate max-w-[60px]">
                                        {imageFile.name}{console.log("imageFile", imageFile)}
                                    </span>
                                )}
                            </label>
                        </div>
                    </>

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
    );
};

export default PostComposer
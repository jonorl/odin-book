import { useState } from 'react';
import { Paperclip } from 'lucide-react'
import { useTheme } from '../hooks/useTheme';
import { useUser } from '../hooks/UseUser'

const PostComposer = ({ redirected }) => {
    const { darkMode } = useTheme();
    const { postDetails, HOST, user } = useUser();
    const [postText, setPostText] = useState('');
    const [imageFile, setImageFile] = useState(null);

    const postMessage = async () => {
        const formData = new FormData();
        if (imageFile) {
            formData.append('imageFile', imageFile);
        }
        formData.append('user[id]', user.id);
        formData.append('postText', postText);
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

    const postComment = async () => {
        const formData = new FormData();
        if (imageFile) {
            formData.append('imageFile', imageFile);
        }
        formData.append('user[id]', user.id);
        formData.append('postText', postText);
        formData.append('originalPostId', postDetails?.id)
        try {
            const res = await fetch(`${HOST}/api/v1/newComment/`, {
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
            <img className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 text-xl" src={user.profilePicUrl}></img>

                <div className="flex-1">
                    <textarea
                        className={`w-full text-xl resize-none focus:outline-none border-none ${darkMode
                            ? 'bg-black text-white placeholder-gray-500'
                            : 'bg-white text-black placeholder-gray-500'
                            }`}
                        placeholder={redirected ? "Post your reply" : "What's happening?"}
                        rows={3}
                        name="text"
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                    />
                    <>
                        <div className="relative flex items-center gap-4 justify-end">
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
                                        {imageFile.name}
                                    </span>
                                )}
                            </label>
                            <button
                                className={`px-6 py-2 rounded-full font-bold ${postText.trim()
                                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                                    : 'bg-blue-300 text-white cursor-not-allowed'
                                    }`}
                                disabled={!postText.trim()}
                                onClick={redirected ? postComment : postMessage}
                            >
                                Post
                            </button>
                        </div>
                    </>

                </div>
            </div>
        </div>
    );
};

export default PostComposer
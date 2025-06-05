import { useState } from 'react';
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal } from 'lucide-react';

const Post = ({ post, darkMode }) => {
    const [liked, setLiked] = useState(post.liked);
    const [retweeted, setRetweeted] = useState(post.retweeted);
    const [likes, setLikes] = useState(post.likes);
    const [retweets, setRetweets] = useState(post.retweets);

    const handleLike = () => {
        setLiked(!liked);
        setLikes(liked ? likes - 1 : likes + 1);
    };

    const handleRetweet = () => {
        setRetweeted(!retweeted);
        setRetweets(retweeted ? retweets - 1 : retweets + 1);
    };

    return (
        <div className={`border-b p-4 cursor-pointer transition-colors ${darkMode
            ? 'border-gray-800 hover:bg-gray-950'
            : 'border-gray-200 hover:bg-gray-50'
            }`}>
            <div className="flex space-x-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 text-xl">
                    {post.user.avatar}
                </div>
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                        <span className={`font-bold ${darkMode ? 'text-white' : 'text-black'}`}>{post.user.name}</span>
                        <span className="text-gray-500">@{post.user.username}</span>
                        <span className="text-gray-500">·</span>
                        <span className="text-gray-500">{post.timestamp}</span>
                        <div className="ml-auto">
                            <button className={`p-1 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
                                }`}>
                                <MoreHorizontal size={16} className={darkMode ? 'text-white' : 'text-black'} />
                            </button>
                        </div>
                    </div>

                    <div className="mb-3">
                        <p className={darkMode ? 'text-gray-200' : 'text-gray-900'}>{post.content}</p>
                    </div>

                    <div className="flex justify-between max-w-md">
                        <button className={`flex items-center space-x-2 rounded-full p-2 group transition-colors ${darkMode
                            ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20'
                            : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50'
                            }`}>
                            <MessageCircle size={18} />
                            <span className="text-sm">{post.replies}</span>
                        </button>

                        <button
                            onClick={handleRetweet}
                            className={`flex items-center space-x-2 rounded-full p-2 group transition-colors ${retweeted
                                ? (darkMode ? 'text-green-400' : 'text-green-500')
                                : (darkMode ? 'text-gray-400 hover:text-green-400 hover:bg-green-900/20' : 'text-gray-500 hover:text-green-500 hover:bg-green-50')
                                }`}
                        >
                            <Repeat2 size={18} />
                            <span className="text-sm">{retweets}</span>
                        </button>

                        <button
                            onClick={handleLike}
                            className={`flex items-center space-x-2 rounded-full p-2 group transition-colors ${liked
                                ? (darkMode ? 'text-red-400' : 'text-red-500')
                                : (darkMode ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/20' : 'text-gray-500 hover:text-red-500 hover:bg-red-50')
                                }`}
                        >
                            <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                            <span className="text-sm">{likes}</span>
                        </button>

                        <button className={`flex items-center space-x-2 rounded-full p-2 group transition-colors ${darkMode
                            ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20'
                            : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50'
                            }`}>
                            <Share size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Post;
import { useState } from 'react'
import { Camera } from "lucide-react";

const SignUpModal = ({ onClose, HOST }) => {
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicFile, setProfilePicFile] = useState(null); // Store the actual file
  const [profilePicPreview, setProfilePicPreview] = useState(null); // Store preview URL
  const [error, setError] = useState(null)

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Store the actual file for upload
      setProfilePicFile(file);
      
      // Create preview URL for display
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('handle', handle);
      formData.append('name', name);
      formData.append('surname', surname);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('confirmPassword', confirmPassword);
      
      // Append the file if it exists
      if (profilePicFile) {
        formData.append('profilePic', profilePicFile);
      }

      const response = await fetch(`${HOST}/api/v1/signup`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        window.location.reload()
        return
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("An unexpected error occurred.", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-black text-white rounded-xl w-full max-w-md p-6 relative shadow-xl">
        {/* Close Button */}
        <button
          className="absolute top-4 left-4 text-white text-2xl"
          onClick={onClose}
        >
          ×
        </button>

        {/* OdinBook Logo */}
        <div className="flex justify-center mb-6">
          <svg width="44" height="60" viewBox="0 0 44 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M8.68927 35.4922L13.148 20.0493H30.9831L35.4419 35.4922H8.68927Z" fill="#EED9C3" />
            <ellipse cx="27.7848" cy="27.8815" rx="1.26005" ry="1.24284" fill="#353535" />
            <path fillRule="evenodd" clipRule="evenodd" d="M19.446 26.4685C19.446 26.0344 19.0892 25.6826 18.6493 25.6826C17.6381 25.6826 15.9035 25.6826 14.8922 25.6826C14.4524 25.6826 14.0955 26.0344 14.0955 26.4685C14.0955 27.1449 14.0955 28.1309 14.0955 28.9019C14.0955 29.5527 14.6306 30.0805 15.2903 30.0805C15.6996 30.0805 16.1763 30.0805 16.6579 30.0805C17.3973 30.0805 18.1063 29.7907 18.6295 29.2748C19.1523 28.7594 19.446 28.0597 19.446 27.3305C19.446 27.0178 19.446 26.7214 19.446 26.4685Z" fill="#A78347" />
            <path fillRule="evenodd" clipRule="evenodd" d="M35.0003 5.29008L43.8516 0.759277L39.0002 18.7593L35.0002 22.7593L35.0003 5.29008Z" fill="#E3B261" />
            <path fillRule="evenodd" clipRule="evenodd" d="M8.85146 5.29008L0.000193596 0.759277L4.85162 18.7593L8.85162 22.7593L8.85146 5.29008Z" fill="#E3B261" />
            <path fillRule="evenodd" clipRule="evenodd" d="M35.4419 13.5028C35.4419 13.5028 28.7537 9.10498 22.0656 9.10498C15.3774 9.10498 8.68927 13.5028 8.68927 13.5028V26.6964L10.4728 30.2147C11.7525 25.352 17.5443 23.3263 21.5759 26.3314L22.0656 26.6964L22.5553 26.3314C26.5868 23.3263 32.3786 25.352 33.6583 30.2147L35.4419 26.6964V13.5028Z" fill="#E3B261" />
            <path fillRule="evenodd" clipRule="evenodd" d="M17.6068 33.2935L14.0398 53.9634L9.12134 50.4451L13.148 35.4924L17.6068 33.2935Z" fill="#D4D4D4" />
            <path fillRule="evenodd" clipRule="evenodd" d="M26.5244 33.2935L30.0914 53.9634L35.0098 50.4451L30.9831 35.4924L26.5244 33.2935Z" fill="#D5D5D5" />
            <path fillRule="evenodd" clipRule="evenodd" d="M8.68927 26.6968L5.12225 39.8904L9.58102 48.6861L13.148 35.4925L8.68927 26.6968Z" fill="#E6E6E6" />
            <path fillRule="evenodd" clipRule="evenodd" d="M35.4418 26.6968L39.0089 39.8904L34.5501 48.6861L30.9831 35.4925L35.4418 26.6968Z" fill="#E6E6E6" />
            <path fillRule="evenodd" clipRule="evenodd" d="M17.6068 33.2937L13.5939 54.8432L22.0655 59.2411L30.5372 54.8432L26.5243 33.2937L22.3981 31.2588L22.0655 31.0947L17.6068 33.2937Z" fill="#E6E6E6" />
            <path fillRule="evenodd" clipRule="evenodd" d="M23.6636 34.1729H20.5425C20.5425 34.1729 20.5425 34.694 20.5425 35.2732C20.5425 35.6813 20.707 36.0723 20.9995 36.3608C21.292 36.6493 21.6884 36.8116 22.1022 36.8116C22.1026 36.8116 22.1035 36.8116 22.1039 36.8116C22.5177 36.8116 22.9141 36.6493 23.2066 36.3608C23.4991 36.0723 23.6636 35.6813 23.6636 35.2732C23.6636 34.694 23.6636 34.1729 23.6636 34.1729Z" fill="#353535" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-6">Create your account</h2>

        {/* Form */}
        <form className="flex flex-col space-y-4">
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <input
            type="text"
            onChange={(e) => setHandle(e.target.value)}
            placeholder="Handle"
            className="bg-transparent border border-gray-600 rounded p-3 placeholder-gray-400 focus:outline-none"
          />
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="bg-transparent border border-gray-600 rounded p-3 placeholder-gray-400 focus:outline-none"
          />
          <input
            type="text"
            onChange={(e) => setSurname(e.target.value)}
            placeholder="Surname"
            className="bg-transparent border border-gray-600 rounded p-3 placeholder-gray-400 focus:outline-none"
          />

          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="bg-transparent border border-gray-600 rounded p-3 placeholder-gray-400 focus:outline-none"
          />
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="bg-transparent border border-gray-600 rounded p-3 placeholder-gray-400 focus:outline-none"
          />

          <input
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Password Confirmation"
            className="bg-transparent border border-gray-600 rounded p-3 placeholder-gray-400 focus:outline-none"
          />

          <div className="flex flex-col space-y-2">
            <label className="text-white font-medium">Profile Picture</label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <label
                  htmlFor="profilePic"
                  className="hover:cursor-pointer flex items-center justify-center w-12 h-12 border-2 border-gray-600 rounded-full overflow-hidden"
                >
                  {profilePicPreview ? (
                    <img
                      src={profilePicPreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera size={24} className="text-white" />
                  )}
                </label>
                <input
                  id="profilePic"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="hidden"
                />
              </div>
              <div className="text-gray-400 text-sm">
                {profilePicFile ? profilePicFile.name : "Click to add your profile picture"}
              </div>
            </div>
          </div>

          <button
            type="submit"
            onClick={(e) => handleSignup(e)}
            className="mt-6 bg-white text-black rounded-full py-2 font-semibold hover:bg-gray-200 transition"
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpModal;
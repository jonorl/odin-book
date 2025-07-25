import { useState, useEffect } from "react";
import { ArrowLeft, Camera, Eye, EyeOff } from "lucide-react";

const Settings = ({ HOST, darkMode, user }) => {
  const [formData, setFormData] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const isDisabled = !!user?.githubId || !!user?.googleId;

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        surname: user.surname || "",
        handle: user.handle || "",
        email: user.email || "",
        password: "",
        profilePicUrl: user.profilePicUrl || ""
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          profilePicUrl: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const submitFormData = new FormData();

      // Add image file if selected
      if (imageFile) {
        submitFormData.append('imageFile', imageFile);
      }

      // Add user data
      submitFormData.append('user[id]', user.id);
      submitFormData.append('name', formData.name);
      submitFormData.append('surname', formData.surname);
      submitFormData.append('handle', formData.handle);
      submitFormData.append('email', formData.email);

      // Only add password if it's not empty
      if (formData.password.trim() !== '') {
        submitFormData.append('password', formData.password);
      }

      const response = await fetch(`${HOST}/api/v1/updateUser/`, {
        method: "PUT",
        body: submitFormData
      });
      const data = await response.json();

      if (response.ok) {
        setMessage("Settings updated successfully!");
        // Clear password field after successful update
        setFormData(prev => ({ ...prev, password: "" }));
      } else {
        setMessage(data.message || "Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      setMessage("An error occurred while updating settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex-1 border ${darkMode ? "border-gray-800" : "border-gray-200"
        }`}
    >
      {/* Header */}
      <div className="flex flex-col bg-black text-white">
        <div className="flex items-center p-4 border-b border-gray-800">
          <button
            onClick={() => history.back()}
            className="cursor-pointer text-white hover:bg-gray-800 rounded-full p-2"
          >
            <ArrowLeft
              size={32}
              className="cursor-pointer hover:bg-gray-900 rounded-full p-1"
            />
          </button>
          <div className="justify-start text-xl font-bold text-white ml-4">
            Settings
          </div>
        </div>

        {/* Settings Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col space-y-2">
              <label className="text-white font-medium">Profile Picture</label>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={formData.profilePicUrl || "/default-avatar.png"}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover bg-gray-700"
                  />
                  <label
                    htmlFor="profilePic"
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <Camera size={24} className="text-white" />
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
                  Click on the image to change your profile picture
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="name" className="text-white font-medium">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your name"
              />
            </div>

            {/* Surname */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="surname" className="text-white font-medium">
                Surname
              </label>
              <input
                id="surname"
                name="surname"
                type="text"
                value={formData.surname}
                onChange={handleInputChange}
                className="bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your surname"
              />
            </div>

            {/* Handle */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="handle" className="text-white font-medium">
                Handle
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-400">@</span>
                <input
                  id="handle"
                  name="handle"
                  type="text"
                  value={formData.handle}
                  onChange={handleInputChange}
                  className="bg-gray-900 border border-gray-700 rounded-md pl-8 pr-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  placeholder="username"
                />
              </div>
            </div>

            {/* Email */}
            <div className={`flex flex-col space-y-2`}>
              <label htmlFor="email" className="text-white font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                disabled={isDisabled}
                value={formData.email}
                title={`${isDisabled && "This field cannot be modified because it's linked to your GitHub/Google account."}`}
                onChange={handleInputChange}
                className={`bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email ${isDisabled ? 'cursor-not-allowed' : ''}
          ${isDisabled ? 'pointer-events-auto' : ''}`}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="password" className="text-white font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  disabled={isDisabled}
                  title={`${isDisabled && "This field cannot be modified because it's linked to your GitHub/Google account."}`}
                  onChange={handleInputChange}
                  className={`bg-gray-900 border border-gray-700 rounded-md px-3 py-2 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full ${isDisabled ? 'cursor-not-allowed' : ''}
                  ${isDisabled ? 'pointer-events-auto' : ''}`}
                  placeholder="Enter new password (leave blank to keep current)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`p-3 rounded-md ${message.includes("successfully")
                  ? "bg-green-900 text-green-200"
                  : "bg-red-900 text-red-200"
                  }`}
              >
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-2 px-4 rounded-md transition-colors ${isLoading ? "cursor-not-allowed" : "cursor-pointer"
                }`}
            >
              {isLoading ? "Updating..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
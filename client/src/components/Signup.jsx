import { useState, useEffect } from "react";
import SignUpModal from "./SignUpModal";
import LoginModal from "./LoginModal";
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { useTheme } from '../hooks/useTheme';
import { useUser } from '../hooks/UseUser'

const SignUpCard = () => {
  const { darkMode } = useTheme();
  const { HOST, user } = useUser();
  const [showSingupModal, setShowSingupModal] = useState(false);
  const [showLoginModal, setLoginModal] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      console.log("Received token:", token);
      localStorage.setItem("token", token); 
      window.history.replaceState({}, document.title, window.location.pathname);
      window.location.reload();
    } 
  }, []);
  const handleGitHubLogin = async (e) => {
    e.preventDefault();
    try {
      window.location.href = `${HOST}/api/v1/auth/github`
    } catch (err) {
      console.log("An unexpected error occurred.", err);
    }
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    try {
      window.location.href = `${HOST}/api/v1/auth/google`
    } catch (err) {
      console.log("An unexpected error occurred.", err);
    }
  };

  // Triggers guest login, which creates a new generic user
  const handleGuestLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${HOST}/api/v1/auth/guest/`, {
        method: 'POST',
      });
      const data = await res.json();

      if (res.ok) {

        localStorage.setItem("token", data.token);
        window.location.reload()
        return
      } else {
        console.log(data.message || "Signup failed");
      }
    } catch (err) {
      console.log("An unexpected error occurred.", err);
    }
  };

  return (
    <>
      {user === null &&
        <div className={`${darkMode
          ? 'bg-black border-gray-800 hover:bg-gray-950'
          : 'bg-white border-gray-200 hover:bg-gray-50'
          }border-rounded p-6 max-w-sm mx-auto rounded-xl border-gray-700`}>
          <h2 className={`${darkMode
            ? 'text-white' : 'text-black'} text-xl font-bold mb-2`}>New to OdinBook?</h2>
          <p className="mb-4 text-gray-400">
            Sign up now to get your own personalized timeline!
          </p>

          <button onClick={() => setShowSingupModal(true)} className={`${darkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'} w-full  font-bold py-2.5 rounded-full mb-4 hover:bg-gray-200 transition`}>
            Create account
          </button>
          {showSingupModal && <SignUpModal HOST={HOST} onClose={() => setShowSingupModal(false)} />}

          <p className="mb-2 text-gray-400">Or login:</p>

          <button onClick={() => setLoginModal(true)} className={`${darkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'} w-full  font-bold py-2.5 rounded-full mb-4 hover:bg-gray-200 transition`}>
            Login
          </button>

          <button onClick={(e) => handleGuestLogin(e)} className={`${darkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'} w-full  font-bold py-2.5 rounded-full mb-4 hover:bg-gray-200 transition`}>
            Login as Guest
          </button>

          <button onClick={(e) => handleGitHubLogin(e)} className={`${darkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'} w-full flex gap-3 content-center justify-center font-bold py-2.5 rounded-full mb-4  transition`}>
            Login with Github <FaGithub className="flex content-center mt-1" />
          </button>

          <button onClick={(e) => handleGoogleLogin(e)} className={`${darkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'} w-full flex gap-3 content-center justify-center font-bold py-2.5 rounded-full mb-4  transition`}>
            Login with Google <FaGoogle className="flex content-center mt-1" />
          </button>
          {showLoginModal && <LoginModal HOST={HOST} onClose={() => setLoginModal(false)} />}

          <p className="text-xs text-gray-500">
            By signing up, you agree to the{" "}
            <a href="#" className="text-blue-400 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-400 hover:underline">
              Privacy Policy
            </a>
            , including{" "}
            <a href="#" className="text-blue-400 hover:underline">
              Cookie Use
            </a>
            .
          </p>
        </div>
      }
    </>
  );
}

export default SignUpCard
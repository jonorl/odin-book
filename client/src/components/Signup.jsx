import { useState } from "react";
import SignUpModal from "./SignUpModal";
import LoginModal from "./LoginModal";

const SignUpCard = ({HOST}) => {
  const [showSingupModal, setShowSingupModal] = useState(false);
  const [showLoginModal, setLoginModal] = useState(false);
  return (
    <>
      <div className="bg-black text-white rounded-xl p-6 max-w-sm mx-auto border border-gray-700">
        <h2 className="text-xl font-bold mb-2">New to OdinBook?</h2>
        <p className="mb-4 text-gray-400">
          Sign up now to get your own personalized timeline!
        </p>

        <button onClick={() => setShowSingupModal(true)} className="w-full bg-white text-black font-bold py-2.5 rounded-full mb-4 hover:bg-gray-200 transition">
          Create account
        </button>
        {showSingupModal && <SignUpModal HOST={HOST} onClose={() => setShowSingupModal(false)} />}

        <p className="mb-2 text-gray-400">Or login:</p>

        <button onClick={() => setLoginModal(true)} className="w-full bg-white text-black font-bold py-2.5 rounded-full mb-4 hover:bg-gray-200 transition">
          Login
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
    </>
  );
}

export default SignUpCard
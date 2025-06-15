import React from "react";

const SignUpCard = ()=> {
  return (
    <div className="bg-black text-white rounded-xl p-6 max-w-sm mx-auto border border-gray-700">
      <h2 className="text-xl font-bold mb-2">New to X?</h2>
      <p className="mb-4 text-gray-400">
        Sign up now to get your own personalized timeline!
      </p>

      <button className="w-full bg-white text-black font-bold py-2.5 rounded-full mb-4 hover:bg-gray-200 transition">
        Create account
      </button>

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
  );
}

export default SignUpCard
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { auth, googleProvider } from "../firebase"; // Ensure this path is correct

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "signup") {
      if (!validatePassword(formData.password)) {
        setError("Password must be at least 8 characters long and include 1 uppercase, 1 lowercase, 1 number, and 1 special character.");
        return;
      }
    }

    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        // Signup
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        // Note: You might want to update the user's display name here as well
      }
      navigate("/dashboard");
    } catch (err) {
      console.error("Auth Error:", err);
      // Firebase error codes are like 'auth/wrong-password'
      setError(err.message.replace('Firebase:', '').trim());
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (err) {
      console.error("Google Auth Error:", err);
      setError(err.message.replace('Firebase:', '').trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 to-purple-700">
      <div className="bg-white p-8 rounded-2xl w-[400px] shadow-lg">
        <h1 className="text-2xl font-bold text-center text-indigo-700 mb-4">
          📖 Author&apos;s Haven
        </h1>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-lg mb-6">
          <button
            type="button"
            onClick={() => { setMode("login"); setError(""); }}
            className={`w-1/2 py-2 ${mode === "login" ? "bg-white shadow rounded-lg" : ""
              }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode("signup"); setError(""); }}
            className={`w-1/2 py-2 ${mode === "signup" ? "bg-white shadow rounded-lg" : ""
              }`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              // Firebase Auth doesn't require name for creation easily, 
              // but we can request it. For now, it's just in the form.
              className="w-full px-4 py-2 border rounded-lg"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          {mode === 'signup' && (
            <p className="text-xs text-gray-500">
              Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-700 text-white py-2 rounded-lg hover:bg-indigo-800 transition"
          >
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-4 flex flex-col items-center">
          <p className="text-gray-500 mb-2">Or continue with</p>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex justify-center items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}

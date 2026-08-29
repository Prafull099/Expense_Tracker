import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import {

  Wallet,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function Login({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setError("");

  //   if (!email || !password) {
  //     setError("Please fill in all fields");
  //     return;
  //   }
  //   if (isSignup && !name) {
  //     setError("Please enter your name");
  //     return;
  //   }
  //   if (password.length < 6) {
  //     setError("Password must be at least 6 characters");
  //     return;
  //   }

  //   setLoading(true);

  //   // Simulate auth delay
  //   setTimeout(() => {
  //     const userData = {
  //       name: isSignup ? name : email.split("@")[0],
  //       email,
  //       joinedAt: new Date().toISOString(),
  //     };
  //     localStorage.setItem("expense_user", JSON.stringify(userData));
  //     onLogin(userData);
  //     setLoading(false);
  //   }, 800);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (isSignup && !name) {
      setError("Please enter your name");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      let response;
      const cleanEmail = email.trim().toLowerCase();

      if (isSignup) {
        response = await axios.post(`${API_BASE_URL}/auth/register`, {
          username: cleanEmail,
          email: cleanEmail,
          password: password,
        });
      } else {
        response = await axios.post(`${API_BASE_URL}/auth/login`, {
          username: cleanEmail,
          password: password,
        });
      }

      console.log(response.data);

      localStorage.setItem("token", response.data.token);

      onLogin({
        name: response.data.name || name || response.data.username,
        email: response.data.email,
        provider: response.data.provider,
      });

    } catch (error) {
      setError(
        error.response?.data?.error || error.response?.data?.message || "Something went wrong"
      );

    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider) => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/${provider}`;
  };


  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 px-4">
      {/* Animated background orbs */}
      <div className="absolute top-[-20%] left-[-15%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-15%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
      <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-bounce"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8 animate-fadeInUp">
          <div className="bg-gradient-to-br from-indigo-400 to-purple-500 p-3 rounded-2xl shadow-lg shadow-indigo-500/30">
            <Wallet className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">ExpenseTracker</span>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 animate-fadeInUp stagger-2">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">
              {isSignup ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-sm text-indigo-200">
              {isSignup
                ? "Start tracking your finances today"
                : "Sign in to manage your expenses"}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex bg-white/10 p-1 rounded-full mb-6">
            <button
              type="button"
              onClick={() => {
                setIsSignup(false);
                setError("");
              }}
              className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${!isSignup
                  ? "bg-white text-gray-800 shadow-md"
                  : "text-white/70 hover:text-white"
                }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignup(true);
                setError("");
              }}
              className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${isSignup
                  ? "bg-white text-gray-800 shadow-md"
                  : "text-white/70 hover:text-white"
                }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/20 border border-red-400/30 rounded-xl px-4 py-2.5 mb-4">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="text-xs font-medium text-indigo-200 mb-1.5 block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Prafull Mishra"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-transparent text-sm transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-indigo-200 mb-1.5 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-indigo-200 mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-transparent text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {!isSignup && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs text-indigo-300 hover:text-indigo-200 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isSignup ? "Create Account" : "Sign In"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/15" />
            <span className="text-xs text-white/40">or continue with</span>
            <div className="flex-1 h-px bg-white/15" />
          </div>

          {/* Social buttons */}
          <div className="flex flex-col gap-2.5">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleOAuthLogin("google")}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white/80 text-sm font-medium hover:bg-white/20 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => handleOAuthLogin("github")}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white/80 text-sm font-medium hover:bg-white/20 transition-all"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub
              </button>
            </div>
            
            <button
              type="button"
              onClick={() => {
                const userData = {
                  name: "Guest User",
                  email: "guest@example.com",
                  joinedAt: new Date().toISOString(),
                };
                localStorage.setItem("expense_user", JSON.stringify(userData));
                onLogin(userData);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs font-medium hover:bg-white/10 hover:text-white transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Try Guest Mode (Offline)
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-indigo-300/50 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

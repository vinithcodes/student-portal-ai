import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ===================================================
  // HANDLE INPUT
  // ===================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setData({
      ...data,
      [name]: value,
    });
  };

  // ===================================================
  // SUBMIT
  // ===================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    // Basic validation
    if (!data.username.trim()) {
      alert("Username is required ❌");
      return;
    }

    if (!data.password.trim()) {
      alert("Password is required ❌");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        username: data.username.trim(),
        password: data.password,
      };

      const res = await axios.post(
        "http://127.0.0.1:8000/login/",
        payload
      );

      // Clear only auth data
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      localStorage.removeItem("role");

      // Save tokens
      localStorage.setItem("token", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("role", res.data.role);

      console.log("Logged in as:", res.data.role);

      // Redirect
      navigate("/dashboard");

    } catch (err) {
      console.log(err);

      if (err.response?.data) {
        alert(err.response.data.error || "Login failed ❌");
      } else {
        alert("Server error ❌");
      }

    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // INPUT STYLE
  // ===================================================
  const inputClass =
    "w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3.5 text-white text-sm placeholder-white/30 outline-none transition-all duration-200 focus:border-violet-500/80 focus:bg-violet-500/10 hover:border-white/30 focus:ring-2 focus:ring-violet-500/20";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080810] px-4 py-10 relative overflow-hidden">

      {/* Background glows */}
      <div className="pointer-events-none fixed top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[120px]" />

      <div className="pointer-events-none fixed bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[100px]" />

      {/* Card */}
      <div className="relative w-full max-w-[440px] z-10">

        {/* Gradient border glow */}
        <div className="absolute -inset-[1px] rounded-[26px] bg-gradient-to-br from-violet-600/50 via-transparent to-emerald-500/30 pointer-events-none" />

        <div className="relative bg-[#111118] rounded-3xl px-8 py-10 border border-white/[0.06]">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/25 text-violet-300 text-[11px] font-semibold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-5">

            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />

            Welcome Back

          </div>

          {/* Heading */}
          <h1 className="font-extrabold text-[2rem] leading-tight tracking-tight text-white mb-1">

            Sign{" "}

            <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
              In
            </span>

          </h1>

          <p className="text-white/60 text-sm font-light mb-7">
            Enter your credentials to access your account
          </p>

          {/* Divider */}
          <div className="h-px bg-white/10 mb-7" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Username */}
            <div className="space-y-1.5">

              <label className="block text-[11px] font-semibold tracking-widest uppercase text-white/60">
                Username
              </label>

              <input
                type="text"
                name="username"
                placeholder="e.g. john_doe"
                value={data.username}
                onChange={handleChange}
                className={inputClass}
                autoComplete="username"
                required
              />

            </div>

            {/* Password */}
            <div className="space-y-1.5">

              <label className="block text-[11px] font-semibold tracking-widest uppercase text-white/60">
                Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={data.password}
                  onChange={handleChange}
                  className={`${inputClass} pr-16`}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold tracking-widest uppercase text-white/50 hover:text-white/90 px-2 py-1 rounded-md transition-all duration-150 hover:bg-white/8"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full mt-2 py-3.5 rounded-xl font-bold text-[15px] text-white tracking-wide overflow-hidden bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-violet-700/30"
            >

              <span className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-xl" />

              {loading ? "Signing In..." : "Sign In →"}

            </button>

          </form>

          {/* Footer */}
          <p className="text-center mt-6 text-sm text-white/50">

            Don't have an account?{" "}

            <Link
              to="/"
              className="text-violet-400 font-semibold hover:text-violet-300 transition-colors duration-150"
            >
              Register
            </Link>

          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;
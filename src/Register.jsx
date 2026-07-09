import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "./api";

function Register() {

  const navigate = useNavigate();

  // ===================================================
  // STATES
  // ===================================================

  const [departments, setDepartments] = useState([]);

  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    college_code: "",
    department: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  // ===================================================
  // LOAD DEPARTMENTS
  // ===================================================



useEffect(() => {
  axios.get(`${API_URL}/department/`)
    .then((res) => {
      setDepartments(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
}, []);
  // ===================================================
  // HANDLE INPUT
  // ===================================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    // Only numbers for college code

    if (name === "college_code") {

      const numericValue =
        value.replace(/\D/g, "");

      setData({
        ...data,
        [name]: numericValue
      });

      return;
    }

    setData({
      ...data,
      [name]: value
    });
  };

  // ===================================================
  // VALIDATION
  // ===================================================

  const validateForm = () => {

    // Username

    if (
      data.username.trim().length < 3
    ) {

      alert(
        "Username must be at least 3 characters ❌"
      );

      return false;
    }

    // College code

    if (
      !/^\d{6}$/.test(
        data.college_code
      )
    ) {

      alert(
        "College code must be exactly 6 digits ❌"
      );

      return false;
    }

    // Department

    if (!data.department) {

      alert(
        "Please select department ❌"
      );

      return false;
    }

    // Password validation

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(
        data.password
      )
    ) {

      alert(
        "Password must contain:\n• 1 uppercase\n• 1 lowercase\n• 1 number\n• Minimum 6 characters ❌"
      );

      return false;
    }

    return true;
  };

  // ===================================================
  // SUBMIT
  // ===================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (loading) return;

    if (!validateForm()) return;

    setLoading(true);

    try {

      const payload = {

        username:
          data.username.trim(),

        email:
          data.email
            .trim()
            .toLowerCase(),

        password: data.password,

        college_code:
          data.college_code.trim(),

        department:
          data.department,
      };

      await axios.post(
  `${API_URL}/register/`,
  payload
);

      alert(
        "Account created successfully 🔥"
      );

      navigate("/login");

    } catch (err) {

      console.log(err);

      if (err.response?.data) {

        const errors =
          Object.values(
            err.response.data
          ).flat();

        alert(errors.join("\n"));

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

      {/* Background Glow */}

      <div className="pointer-events-none fixed top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[120px]" />

      <div className="pointer-events-none fixed bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[100px]" />

      {/* Card */}

      <div className="relative w-full max-w-[440px] z-10">

        {/* Border Glow */}

        <div className="absolute -inset-[1px] rounded-[26px] bg-gradient-to-br from-violet-600/50 via-transparent to-emerald-500/30 pointer-events-none" />

        <div className="relative bg-[#111118] rounded-3xl px-8 py-10 border border-white/[0.06]">

          {/* Badge */}

          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/25 text-violet-300 text-[11px] font-semibold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-5">

            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />

            New Account

          </div>

          {/* Heading */}

          <h1 className="font-extrabold text-[2rem] leading-tight tracking-tight text-white mb-1">

            Join the{" "}

            <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">

              Platform

            </span>

          </h1>

          <p className="text-white/60 text-sm font-light mb-7">

            Create your account to get started

          </p>

          {/* Divider */}

          <div className="h-px bg-white/10 mb-7" />

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Username */}

            <div className="space-y-1.5">

              <label className="block text-[11px] font-semibold tracking-widest uppercase text-white/60">

                Username

              </label>

              <input
                type="text"
                name="username"
                value={data.username}
                placeholder="e.g. john_doe"
                onChange={handleChange}
                className={inputClass}
                autoComplete="username"
                required
              />

            </div>

            {/* Email */}

            <div className="space-y-1.5">

              <label className="block text-[11px] font-semibold tracking-widest uppercase text-white/60">

                Email Address

              </label>

              <input
                type="email"
                name="email"
                value={data.email}
                placeholder="you@example.com"
                onChange={handleChange}
                className={inputClass}
                autoComplete="email"
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
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={data.password}
                  placeholder="1 uppercase • 1 lowercase • 1 number"
                  onChange={handleChange}
                  className={`${inputClass} pr-16`}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold tracking-widest uppercase text-white/50 hover:text-white/90 px-2 py-1 rounded-md transition-all duration-150 hover:bg-white/8"
                >

                  {showPassword
                    ? "Hide"
                    : "Show"}

                </button>

              </div>

            </div>

            {/* College Code */}

            <div className="space-y-1.5">

              <label className="block text-[11px] font-semibold tracking-widest uppercase text-white/60">

                College Code

              </label>

              <input
                type="text"
                name="college_code"
                value={data.college_code}
                placeholder="6-digit code"
                onChange={handleChange}
                maxLength={6}
                className={inputClass}
                required
              />

              <p className="text-[11px] text-white/40 pl-0.5">

                Enter the 6-digit code provided by your institution

              </p>

            </div>

            {/* Department */}

            <div className="space-y-1.5">

              <label className="block text-[11px] font-semibold tracking-widest uppercase text-white/60">

                Department

              </label>

              <select
  name="department"
  value={data.department}
  onChange={handleChange}
  required
  className="
    w-full
    bg-[#1a1a22]
    text-white
    border
    border-white/20
    rounded-xl
    px-4
    py-3.5
    outline-none
  "
>

                <option value="">
                  Select Department
                </option>

                {departments.map((dept) => (

                  <option
                    key={dept.id}
                    value={dept.id}
                  >

                    {dept.name}

                  </option>

                ))}

              </select>

            </div>

            {/* Submit Button */}

            <button
              type="submit"
              disabled={loading}
              className="relative w-full mt-2 py-3.5 rounded-xl font-bold text-[15px] text-white tracking-wide overflow-hidden bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-violet-700/30"
            >

              <span className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-xl" />

              {loading ? (

                <span className="flex items-center justify-center gap-2">

                  <svg
                    className="w-4 h-4 animate-spin text-white/70"
                    viewBox="0 0 24 24"
                    fill="none"
                  >

                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />

                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                    />

                  </svg>

                  Creating account...

                </span>

              ) : (

                "Create Account →"

              )}

            </button>

          </form>

          {/* Footer */}

          <p className="text-center mt-6 text-sm text-white/50">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-violet-400 font-semibold hover:text-violet-300 transition-colors duration-150"
            >

              Sign in

            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;
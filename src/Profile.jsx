import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import API_URL from "./api";


function Profile() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [data, setData] = useState({
  username: "",
  email: "",
  profile_image: null,

  current_password: "",
  new_password: "",
  confirm_password: "",
});

  const [showPass, setShowPass] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // ===================================================
  // GET PROFILE
  // ===================================================
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`${API_URL}/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
  setData((prev) => ({
    ...prev,
    username: res.data.username,
    email: res.data.email,
    profile_image: res.data.profile_image,
  }));
})
      .catch(() => {
        localStorage.clear();
        navigate("/login");
      });
  }, [navigate, token]);

  // ===================================================
  // HANDLE INPUT
  // ===================================================
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  // ===================================================
  // UPDATE PROFILE
  // ===================================================
  const handleUpdate = async () => {

  if (!data.username.trim()) {

    return toast.error("Username required ❌");

  }

  try {

    const formData = new FormData();

    formData.append(
      "username",
      data.username.trim()
    );

    formData.append(
      "email",
      data.email
    );

    // IMAGE

    if (
      data.profile_image &&
      typeof data.profile_image !== "string"
    ) {

      formData.append(
        "profile_image",
        data.profile_image
      );

    }

    await axios.put(
      `${API_URL}/profile/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    toast.success(
      "Profile Updated 🔥"
    );

  } catch (err) {

    toast.error(
      err.response?.data?.error ||
      "Update failed ❌"
    );

  }
};
  // ===================================================
  // CHANGE PASSWORD
  // ===================================================
  const handlePasswordChange = async () => {

    // Empty fields
    if (
      !data.current_password ||
      !data.new_password ||
      !data.confirm_password
    ) {
      return toast.error("All password fields required ❌");
    }

    // Password match
    if (data.new_password !== data.confirm_password) {
      return toast.error("Passwords do not match ❌");
    }

    // Password validation
    if (!/(?=.*[A-Z])(?=.*\d)/.test(data.new_password)) {
      return toast.error(
        "Password must contain 1 uppercase & 1 number ❌"
      );
    }

    try {
      await axios.post(
        `${API_URL}/change-password/`,
        {
          current_password: data.current_password,
          new_password: data.new_password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Password Changed 🔐");

      setData((prev) => ({
        ...prev,
        current_password: "",
        new_password: "",
        confirm_password: "",
      }));

    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed ❌"
      );
    }
  };

  // ===================================================
  // ROLE BADGE
  // ===================================================
  const getRoleBadge = () => {
    if (role === "superadmin") {
      return {
        label: "Super Admin",
        cls: "bg-violet-500/15 border-violet-500/30 text-violet-300",
        dot: "bg-violet-400",
      };
    }

    if (role === "admin") {
      return {
        label: "Admin",
        cls: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
        dot: "bg-emerald-400",
      };
    }

    return {
      label: "User",
      cls: "bg-sky-500/15 border-sky-500/30 text-sky-300",
      dot: "bg-sky-400",
    };
  };

  const badge = getRoleBadge();

  // ===================================================
  // CLASSES
  // ===================================================
  const inputClass =
    "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 text-white text-sm placeholder-white/30 outline-none transition-all duration-200 focus:border-violet-500/70 focus:bg-violet-500/8 hover:border-white/25 focus:ring-2 focus:ring-violet-500/15";

  const readonlyClass =
    "w-full bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3.5 text-white/40 text-sm outline-none cursor-not-allowed";

  // ===================================================
  // TABS
  // ===================================================
  const tabs = [
    {
      id: "profile",
      label: "Profile Info",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="8" r="4" />
          <path
            d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      id: "security",
      label: "Security",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* BG GLOWS */}
      <div className="pointer-events-none fixed top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/15 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/8 blur-[100px]" />

      {/* TOASTER */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1a1a2e",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            fontSize: "13px",
          },
        }}
      />

      <div className="relative w-full max-w-[460px] z-10">

        {/* BORDER GLOW */}
        <div className="absolute -inset-[1px] rounded-[26px] bg-gradient-to-br from-violet-600/50 via-transparent to-emerald-500/30 pointer-events-none" />

        <div className="relative bg-[#111118] rounded-3xl border border-white/[0.06] overflow-hidden">

          {/* HEADER */}
          <div className="relative px-8 pt-8 pb-6 border-b border-white/[0.06]">

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

            <div className="flex items-center gap-4">

              {/* AVATAR */}
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/40 to-emerald-500/40 border border-white/10 flex items-center justify-center text-white font-extrabold text-2xl">
                  {data.username
                    ? data.username[0].toUpperCase()
                    : "U"}
                </div>

                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#111118]" />
              </div>

              {/* USER INFO */}
              <div className="min-w-0">
                <h2 className="text-white font-extrabold text-xl tracking-tight truncate">
                  {data.username || "Loading..."}
                </h2>

                <p className="text-white/40 text-sm truncate">
                  {data.email}
                </p>

                <div
                  className={`mt-2 inline-flex items-center gap-1.5 border text-[11px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full ${badge.cls}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full animate-pulse ${badge.dot}`}
                  />
                  {badge.label}
                </div>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="flex border-b border-white/[0.06] px-2 pt-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-all duration-150 ${
                  activeTab === tab.id
                    ? "text-violet-300 border-b-2 border-violet-500 bg-violet-500/5"
                    : "text-white/35 hover:text-white/60"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* CONTENT */}
          <div className="px-8 py-7">

            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="space-y-4">

                <div>
                  <p className="text-[11px] font-semibold tracking-widest uppercase text-white/40 mb-1.5">
                    Profile Information
                  </p>

                  <p className="text-white/30 text-xs mb-5">
                    Update your display name below
                  </p>
                </div>

                {/* PROFILE IMAGE */}

<div className="flex justify-center mb-6">

  <label className="relative cursor-pointer group">

    <img
      src={
        data.profile_image
          ? typeof data.profile_image === "string"
            ? data.profile_image
            : URL.createObjectURL(data.profile_image)
          : `https://ui-avatars.com/api/?name=${data.username}&background=7c3aed&color=fff`
      }
      alt="profile"
      className="
        w-28
        h-28
        rounded-full
        object-cover
        border-4
        border-violet-500/30
        shadow-lg
        shadow-violet-900/40
      "
    />

    {/* EDIT BUTTON */}

    <div
      className="
        absolute
        bottom-1
        right-1
        w-9
        h-9
        rounded-full
        bg-violet-600
        flex
        items-center
        justify-center
        text-white
        text-sm
        border
        border-white/10
        group-hover:scale-110
        transition-all
      "
    >
      ✏️
    </div>

    {/* FILE INPUT */}

    <input
      type="file"
      hidden
      accept="image/*"
      onChange={(e) =>
        setData({
          ...data,
          profile_image: e.target.files[0],
        })
      }
    />

  </label>

</div>

                {/* USERNAME */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold tracking-widest uppercase text-white/55">
                    Username
                  </label>

                  <input
                    name="username"
                    value={data.username}
                    onChange={handleChange}
                    placeholder="Username"
                    className={inputClass}
                  />
                </div>

                {/* EMAIL */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold tracking-widest uppercase text-white/55">
                    Email Address
                  </label>

                  <div className="relative">
                    <input
                      name="email"
                      value={data.email}
                      readOnly
                      className={readonlyClass}
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold tracking-widest uppercase text-white/20 bg-white/5 border border-white/8 px-2 py-0.5 rounded-md">
                      Locked
                    </span>
                  </div>

                  <p className="text-[11px] text-white/25 pl-0.5">
                    Email cannot be changed
                  </p>
                </div>

                {/* SAVE BUTTON */}
                <button
                  onClick={handleUpdate}
                  className="relative w-full mt-2 py-3.5 rounded-xl font-bold text-[15px] text-white tracking-wide overflow-hidden bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-violet-700/25"
                >
                  <span className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-xl" />

                  Save Changes →
                </button>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === "security" && (
              <div className="space-y-4">

                <div>
                  <p className="text-[11px] font-semibold tracking-widest uppercase text-white/40 mb-1.5">
                    Change Password
                  </p>

                  <p className="text-white/30 text-xs mb-5">
                    Use a strong password with uppercase & numbers
                  </p>
                </div>

                {/* CURRENT PASSWORD */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold tracking-widest uppercase text-white/55">
                    Current Password
                  </label>

                  <input
                    type={showPass ? "text" : "password"}
                    name="current_password"
                    value={data.current_password}
                    onChange={handleChange}
                    placeholder="Enter current password"
                    className={inputClass}
                  />
                </div>

                {/* NEW PASSWORD */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold tracking-widest uppercase text-white/55">
                    New Password
                  </label>

                  <input
                    type={showPass ? "text" : "password"}
                    name="new_password"
                    value={data.new_password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    className={inputClass}
                  />
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold tracking-widest uppercase text-white/55">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      name="confirm_password"
                      value={data.confirm_password}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                      className={`${inputClass} pr-16`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold tracking-widest uppercase text-white/45 hover:text-white/80 px-2 py-1 rounded-md transition-all duration-150 hover:bg-white/6"
                    >
                      {showPass ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* PASSWORD STATUS */}
                {data.confirm_password && (
                  <div
                    className={`flex items-center gap-2 text-xs font-medium px-1 ${
                      data.new_password === data.confirm_password
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        data.new_password === data.confirm_password
                          ? "bg-emerald-400"
                          : "bg-red-400"
                      }`}
                    />

                    {data.new_password === data.confirm_password
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </div>
                )}

                {/* UPDATE PASSWORD */}
                <button
                  onClick={handlePasswordChange}
                  className="relative w-full mt-2 py-3.5 rounded-xl font-bold text-[15px] text-white tracking-wide overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-emerald-700/20"
                >
                  <span className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-xl" />

                  Update Password →
                </button>
              </div>
            )}

            {/* BACK BUTTON */}
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white/40 hover:text-white/70 hover:bg-white/5 border border-white/[0.06] hover:border-white/12 transition-all duration-150"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 12H5M12 5l-7 7 7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              Back to Dashboard
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
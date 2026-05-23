import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import SuperAdmin from "./SuperAdmin";
import Admin from "./Admin";
import User from "./User";
import FloatingChat from "./FloatingChat";
import Department from "./Department";
import Subject from "./Subject";

function Dashboard() {

  const navigate = useNavigate();

  const [activePage, setActivePage] = useState("dashboard");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [user, setUser] = useState({
    username: "",
    email: "",
    role: "",
    profile_image: "",
  });

  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("refresh");

    localStorage.removeItem("role");

    navigate("/login");

  };

  // ===================================================
  // FETCH PROFILE
  // ===================================================

  useEffect(() => {

    const token = localStorage.getItem("token");

    const savedRole = localStorage.getItem("role");

    if (!token || token === "undefined") {

      navigate("/login");

      return;

    }

    axios
      .get(
        "http://127.0.0.1:8000/profile/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      .then((res) => {

        setUser({
          username: res.data.username,
          email: res.data.email,
          role: res.data.role || savedRole,
          profile_image:
            res.data.profile_image,
        });

      })

      .catch(() => {

        localStorage.removeItem("token");

        localStorage.removeItem("refresh");

        localStorage.removeItem("role");

        navigate("/login");

      });

  }, [navigate]);

  // ===================================================
  // ROLE BASED CONTENT
  // ===================================================

  const renderContent = () => {

    switch (activePage) {

      // =========================================
      // DEPARTMENT
      // =========================================

      case "department":

        return <Department />;

      // =========================================
      // SUBJECT
      // =========================================

      case "subject":

        return <Subject />;

      // =========================================
      // DASHBOARD
      // =========================================

      case "dashboard":

        if (user.role === "superadmin") {

          return <SuperAdmin />;

        }

        if (user.role === "admin") {

          return <Admin />;

        }

        return <User />;

      default:

        return <User />;

    }

  };

  // ===================================================
  // ROLE BADGE
  // ===================================================

  const getRoleBadge = () => {

    if (user.role === "superadmin") {

      return {
        label: "Super Admin",
        cls:
          "bg-violet-500/15 border-violet-500/30 text-violet-300",
        dot: "bg-violet-400",
      };

    }

    if (user.role === "admin") {

      return {
        label: "Admin",
        cls:
          "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
        dot: "bg-emerald-400",
      };

    }

    return {
      label: "User",
      cls:
        "bg-sky-500/15 border-sky-500/30 text-sky-300",
      dot: "bg-sky-400",
    };

  };

  const badge = getRoleBadge();

  // ===================================================
  // NAVIGATION ITEMS
  // ===================================================

  const navItems = [

    // =========================================
    // DASHBOARD
    // =========================================

    {
      label: "Dashboard",

      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <rect
            x="3"
            y="3"
            width="7"
            height="7"
            rx="1"
          />

          <rect
            x="14"
            y="3"
            width="7"
            height="7"
            rx="1"
          />

          <rect
            x="3"
            y="14"
            width="7"
            height="7"
            rx="1"
          />

          <rect
            x="14"
            y="14"
            width="7"
            height="7"
            rx="1"
          />
        </svg>
      ),

      active: activePage === "dashboard",

      action: () => {

        setActivePage("dashboard");

        setSidebarOpen(false);

      },

    },

    // =========================================
    // ADMIN / SUPERADMIN MENUS
    // =========================================

    ...(user.role !== "user"

      ? [

          // =====================================
          // DEPARTMENT
          // =====================================

          {
            label: "Departments",

            icon: (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M3 21h18"
                  strokeLinecap="round"
                />

                <path
                  d="M5 21V7l7-4 7 4v14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),

            active:
              activePage === "department",

            action: () => {

              setActivePage("department");

              setSidebarOpen(false);

            },

          },

          // =====================================
          // SUBJECTS
          // =====================================

          {
            label: "Subjects",

            icon: (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 19.5A2.5 2.5 0 016.5 17H20"
                  strokeLinecap="round"
                />

                <path
                  d="M6.5 2H20v15H6.5A2.5 2.5 0 004 19.5V4.5A2.5 2.5 0 016.5 2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),

            active:
              activePage === "subject",

            action: () => {

              setActivePage("subject");

              setSidebarOpen(false);

            },

          },

        ]

      : []),

    // =========================================
    // PROFILE
    // =========================================

    {
      label: "Profile",

      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="8"
            r="4"
          />

          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      ),

      active: false,

      action: () => {

        navigate("/profile");

      },

    },

  ];

  return (

    <div className="flex min-h-screen bg-[#080810] relative overflow-hidden">

      {/* BACKGROUND GLOW */}

      <div className="pointer-events-none fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[100px]" />

      <div className="pointer-events-none fixed bottom-[-15%] left-[10%] w-[400px] h-[400px] rounded-full bg-emerald-500/8 blur-[90px]" />

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (

        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />

      )}

      {/* =================================================== */}
      {/* SIDEBAR */}
      {/* =================================================== */}

      <aside
        className={`
          fixed md:relative z-30 md:z-auto
          h-full md:h-auto
          w-64 flex-shrink-0
          bg-[#0e0e16]
          border-r border-white/[0.06]
          flex flex-col
          transition-transform duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >

        {/* LOGO */}

        <div className="px-6 py-7 border-b border-white/[0.06]">

          <div className="flex items-center gap-3">

            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-emerald-500 flex items-center justify-center">

              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 3L1 9l11 6 11-6-11-6z"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>

            </div>

            <span className="text-white font-extrabold text-lg tracking-tight">

              Portal

            </span>

          </div>

        </div>

        {/* USER INFO */}

        <div className="px-5 py-5 border-b border-white/[0.06]">

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/10 bg-white/5">

              {user.profile_image ? (

                <img
                  src={user.profile_image}
                  alt="profile"
                  className="w-full h-full object-cover"
                />

              ) : (

                <div className="w-full h-full bg-gradient-to-br from-violet-500/40 to-emerald-500/40 flex items-center justify-center text-white font-bold text-sm">

                  {user.username
                    ? user.username
                        .charAt(0)
                        .toUpperCase()
                    : "U"}

                </div>

              )}

            </div>

            <div className="min-w-0">

              <p className="text-white text-sm font-semibold truncate">

                {user.username || "User"}

              </p>

              <p className="text-white/40 text-xs truncate">

                {user.email || ""}

              </p>

            </div>

          </div>

          {/* ROLE BADGE */}

          <div
            className={`mt-3 inline-flex items-center gap-1.5 border text-[11px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full ${badge.cls}`}
          >

            <span
              className={`w-1.5 h-1.5 rounded-full animate-pulse ${badge.dot}`}
            />

            {badge.label}

          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 px-4 py-5 space-y-1">

          <p className="text-[10px] font-semibold tracking-widest uppercase text-white/25 px-2 mb-3">

            Navigation

          </p>

          {navItems.map((item) => (

            <button
              key={item.label}
              onClick={item.action}
              className={`
                w-full
                flex
                items-center
                gap-3
                px-3
                py-2.5
                rounded-xl
                text-sm
                font-medium
                transition-all
                duration-150
                text-left

                ${
                  item.active
                    ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                    : "text-white/50 hover:text-white/90 hover:bg-white/5"
                }
              `}
            >

              {item.icon}

              {item.label}

            </button>

          ))}

        </nav>

        {/* LOGOUT */}

        <div className="px-4 pb-6">

          <div className="h-px bg-white/[0.06] mb-4" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/80 hover:text-red-300 hover:bg-red-500/10 transition-all duration-150"
          >

            Logout

          </button>

        </div>

      </aside>

      {/* =================================================== */}
      {/* MAIN CONTENT */}
      {/* =================================================== */}

      <div className="flex-1 flex flex-col min-w-0">

        {/* TOPBAR */}

        <header className="flex items-center justify-between px-6 py-4 bg-[#0e0e16]/80 backdrop-blur-sm border-b border-white/[0.06] sticky top-0 z-10">

          <div>

            <h1 className="text-white font-extrabold text-lg">

              Welcome back,
              <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent ml-2">

                {user.username || "User"}

              </span>

            </h1>

          </div>

        </header>

        {/* CONTENT */}

        <main className="flex-1 p-6">

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">

            {/* LEFT */}

            <div className="xl:col-span-2 overflow-auto">

              {renderContent()}

            </div>

            {/* RIGHT CHAT */}

            <div className="hidden xl:block h-[calc(100vh-110px)] sticky top-[90px] overflow-hidden">

              <FloatingChat />

            </div>

          </div>

        </main>

      </div>

    </div>

  );

}

export default Dashboard;
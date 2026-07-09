import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import API_URL from "./api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function SuperAdmin() {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ===================================================
  // STATES
  // ===================================================

  const [users, setUsers] = useState([]);

  const [results, setResults] = useState([]);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const USERS_PER_PAGE = 5;

  // ===================================================
  // FETCH DATA
  // ===================================================

  useEffect(() => {

    if (!token) {

      navigate("/login");

      return;
    }

    // USERS
    axios
      .get(
       `${API_URL}/users/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {

        // REMOVE SUPERADMIN FROM TABLE
        const filtered = res.data.filter(
          (u) => !u.is_superuser
        );

        setUsers(filtered);

      })
      .catch(() => {

        toast.error(
          "Failed to load users ❌"
        );

      });

    // RESULTS
    axios
      .get(
        `${API_URL}/results/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {

        setResults(res.data);

      })
      .catch(() => {

        toast.error(
          "Failed to load results ❌"
        );

      });

  }, [token, navigate]);

  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout = () => {

    localStorage.clear();

    navigate("/login");
  };

  // ===================================================
  // ROLE CHANGE
  // ===================================================

  const handleRoleChange = (
    id,
    newRole
  ) => {

    axios
      .put(
        `${API_URL}/users/${id}/role/`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {

        toast.success(
          "Role updated 🔥"
        );

        setUsers((prev) =>
          prev.map((u) =>
            u.id === id
              ? {
                  ...u,
                  role: newRole,
                }
              : u
          )
        );
      })
      .catch(() => {

        toast.error(
          "Failed to update role ❌"
        );

      });
  };

  // ===================================================
  // DELETE USER
  // ===================================================

  const handleDelete = (id) => {

    if (
      !window.confirm(
        "Delete this user?"
      )
    )
      return;

    axios
      .delete(
        `${API_URL}/users/${id}/delete/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {

        toast.success(
          "User deleted 🗑️"
        );

        setUsers((prev) =>
          prev.filter(
            (u) => u.id !== id
          )
        );

        if (
          paginatedUsers.length === 1 &&
          page > 1
        ) {

          setPage((prev) => prev - 1);
        }
      })
      .catch(() => {

        toast.error(
          "Failed to delete user ❌"
        );

      });
  };

  // ===================================================
  // FILTER USERS
  // ===================================================

  const filteredUsers = useMemo(() => {

    return users.filter((u) =>
      u.username
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||
      u.email
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||
      (
        u.college_code || ""
      ).includes(search)
    );

  }, [users, search]);

  // ===================================================
  // PAGINATION
  // ===================================================

  const totalPages = Math.ceil(
    filteredUsers.length /
      USERS_PER_PAGE
  );

  const paginatedUsers =
    filteredUsers.slice(
      (page - 1) *
        USERS_PER_PAGE,
      page * USERS_PER_PAGE
    );

  // ===================================================
  // STATS
  // ===================================================

  const totalAdmins =
    users.filter(
      (u) => u.role === "admin"
    ).length;

  const totalUsers = users.length;

  const totalStudents =
    users.filter(
      (u) => u.role === "user"
    ).length;

  // ===================================================
  // CHART DATA
  // ===================================================

  const pieData = [
    {
      name: "Admins",
      value: totalAdmins,
    },
    {
      name: "Students",
      value: totalStudents,
    },
  ];

  const barData = [
    {
      name: "Total",
      value: totalUsers,
    },
    {
      name: "Admins",
      value: totalAdmins,
    },
    {
      name: "Students",
      value: totalStudents,
    },
  ];

  const PIE_COLORS = [
    "#34d399",
    "#8b5cf6",
  ];

  const BAR_COLORS = [
    "#8b5cf6",
    "#34d399",
    "#38bdf8",
  ];

  // ===================================================
  // ROLE STYLE
  // ===================================================

  const getRoleStyle = (role) => {

    if (role === "admin") {

      return "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30";
    }

    return "bg-sky-500/15 text-sky-300 border border-sky-500/30";
  };

  // ===================================================
  // STAT CARDS
  // ===================================================

  const statCards = [
    {
      label: "Total Users",
      value: totalUsers,
      accent:
        "from-violet-500/20 to-violet-500/5",
      border:
        "border-violet-500/20",
      text: "text-violet-300",
    },
    {
      label: "Admins",
      value: totalAdmins,
      accent:
        "from-emerald-500/20 to-emerald-500/5",
      border:
        "border-emerald-500/20",
      text: "text-emerald-300",
    },
    {
      label: "Students",
      value: totalStudents,
      accent:
        "from-sky-500/20 to-sky-500/5",
      border:
        "border-sky-500/20",
      text: "text-sky-300",
    },
  ];

  return (

    <div className="min-h-screen bg-[#080810] text-white relative overflow-hidden">

      {/* BG */}
      <div className="pointer-events-none fixed top-[-15%] right-[-5%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[100px]" />

      <div className="pointer-events-none fixed bottom-[-10%] left-[5%] w-[400px] h-[400px] rounded-full bg-emerald-500/8 blur-[90px]" />

      {/* TOAST */}
      <Toaster
        position="top-right"
      />

      <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">

          <div>

            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/25 text-violet-300 text-[11px] font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full mb-3">

              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />

              Super Admin
            </div>

            <h1 className="text-3xl font-extrabold">

              Admin{" "}

              <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">

                Control Panel

              </span>
            </h1>

            <p className="text-white/40 text-sm mt-1">

              Manage users and results

            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400"
          >
            Logout
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

          {statCards.map((card) => (

            <div
              key={card.label}
              className={`bg-gradient-to-br ${card.accent} border ${card.border} rounded-2xl p-5`}
            >

              <p className="text-[11px] uppercase tracking-widest text-white/40 mb-3">

                {card.label}

              </p>

              <h2
                className={`text-4xl font-extrabold ${card.text}`}
              >

                {card.value}

              </h2>
            </div>

          ))}
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

          {/* PIE */}
          <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-6">

            <h3 className="text-white font-bold mb-5">

              User Breakdown

            </h3>

            <div className="h-52">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={pieData}
                    dataKey="value"
                    outerRadius={75}
                    innerRadius={40}
                  >

                    {pieData.map((_, i) => (

                      <Cell
                        key={i}
                        fill={PIE_COLORS[i]}
                      />

                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* BAR */}
          <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-6">

            <h3 className="text-white font-bold mb-5">

              User Count

            </h3>

            <div className="h-52">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={barData}
                  barSize={32}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                  />

                  <XAxis
                    dataKey="name"
                  />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="value"
                    radius={[
                      6,
                      6,
                      0,
                      0,
                    ]}
                  >

                    {barData.map(
                      (_, i) => (
                        <Cell
                          key={i}
                          fill={
                            BAR_COLORS[i]
                          }
                        />
                      )
                    )}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* USER TABLE */}
        <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-6 mb-8">

          <div className="flex justify-between gap-4 mb-6">

            <h3 className="text-white font-bold text-lg">

              User Directory

            </h3>

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => {

                setSearch(
                  e.target.value
                );

                setPage(1);

              }}
              className="bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-sm text-white"
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/[0.06]">

            <table className="min-w-[700px] w-full text-sm">

              <thead>

                <tr className="bg-white/[0.03] border-b border-white/[0.06]">

                  {[
                    "Username",
                    "Email",
                    "College Code",
                    "Department",
                    "Role",
                    "Actions",
                  ].map((h) => (

                    <th
                      key={h}
                      className="text-left px-4 py-3 text-[11px] uppercase tracking-widest text-white/35"
                    >

                      {h}

                    </th>

                  ))}
                </tr>
              </thead>

              <tbody>

                {paginatedUsers.map(
                  (user) => (

                    <tr
                      key={user.id}
                      className="border-b border-white/[0.04]"
                    >

                      <td className="px-4 py-3">

                        {user.username}

                      </td>

                      <td className="px-4 py-3 text-white/55">

                        {user.email}

                      </td>

                      <td className="px-4 py-3">

                        {user.college_code ||
                          "—"}

                      </td>

                      <td className="px-4 py-3">

                        {user.department_name ||
                          "—"}

                      </td>

                      <td className="px-4 py-3">

                        <select
                          value={
                            user.role
                          }
                          onChange={(e) =>
                            handleRoleChange(
                              user.id,
                              e.target
                                .value
                            )
                          }
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border outline-none ${getRoleStyle(
                            user.role
                          )}`}
                        >

                          <option value="user">

                            User

                          </option>

                          <option value="admin">

                            Admin

                          </option>
                        </select>
                      </td>

                      <td className="px-4 py-3">

                        <button
                          onClick={() =>
                            handleDelete(
                              user.id
                            )
                          }
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold"
                        >

                          Delete

                        </button>
                      </td>
                    </tr>

                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RESULTS SECTION */}
        <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-6">

          <h3 className="text-xl font-bold mb-6">

            Student Results

          </h3>

          <div className="space-y-5">

            {results.map((r) => {

              const total =
                r.marks.reduce(
                  (sum, m) =>
                    sum +
                    Number(m.mark),
                  0
                );

              const avg =
                r.marks.length > 0
                  ? (
                      total /
                      r.marks.length
                    ).toFixed(1)
                  : 0;

              const pass =
                r.marks.every(
                  (m) =>
                    Number(m.mark) >=
                    35
                );

              return (

                <div
                  key={r.id}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5"
                >

                  <div className="flex justify-between flex-wrap gap-3 mb-5">

                    <div>

                      <h4 className="text-lg font-bold">

                        {r.username}

                      </h4>

                      <p className="text-white/40 text-sm">

                        Semester{" "}
                        {r.semester}

                      </p>
                    </div>

                    <div className="text-right">

                      <p className="text-emerald-400 font-bold">

                        Total: {total}

                      </p>

                      <p className="text-sky-400 text-sm">

                        Avg: {avg}

                      </p>

                      <p
                        className={`text-sm font-semibold ${
                          pass
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >

                        {pass
                          ? "PASS"
                          : "FAIL"}

                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">

                    {r.marks.map((m) => (

                      <div
                        key={m.id}
                        className="bg-black/30 rounded-lg p-3 border border-white/[0.05]"
                      >

                        <p className="text-xs text-white/40 mb-1">

                          {
                            m.subject_name
                          }

                        </p>

                        <p className="text-2xl font-bold">

                          {m.mark}

                        </p>
                      </div>

                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAdmin;
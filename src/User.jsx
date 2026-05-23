import { useEffect, useState } from "react";
import axios from "axios";

function User() {

  const token = localStorage.getItem("token") || "";

  const [results, setResults] = useState([]);
  const [selectedSem, setSelectedSem] = useState("");

  // =====================================================
  // LOAD RESULTS
  // =====================================================

  useEffect(() => {

    if (!token) return;

    axios
      .get(
        "http://127.0.0.1:8000/my-results/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      .then((res) => {

        console.log(res.data);

        setResults(res.data);

      })

      .catch((err) => {

        console.log(
          "Error loading results:",
          err
        );

      });

  }, [token]);

  // =====================================================
  // HELPERS
  // =====================================================

  const getTotal = (r) => {

    return r.marks.reduce(
      (sum, m) => sum + Number(m.mark),
      0
    );

  };

  const getAverage = (r) => {

    if (!r.marks.length) return 0;

    return (
      getTotal(r) / r.marks.length
    ).toFixed(2);

  };

  const getResult = (r) => {

    return r.marks.some(
      (m) => Number(m.mark) < 35
    )
      ? "Fail"
      : "Pass";

  };

  const getGrade = (avg) => {

    avg = Number(avg);

    if (avg >= 90) return "A+";

    if (avg >= 75) return "A";

    if (avg >= 60) return "B";

    if (avg >= 40) return "C";

    return "D";
  };

  const getRemark = (avg) => {

    avg = Number(avg);

    if (avg >= 90)

      return {
        text: "Excellent",
        icon: "🔥",
        cls: "text-emerald-400",
      };

    if (avg >= 75)

      return {
        text: "Very Good",
        icon: "👍",
        cls: "text-sky-400",
      };

    if (avg >= 60)

      return {
        text: "Good",
        icon: "🙂",
        cls: "text-violet-400",
      };

    return {
      text: "Needs Improvement",
      icon: "⚠️",
      cls: "text-amber-400",
    };
  };

  const getGradeStyle = (grade) => {

    if (grade === "A+")

      return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";

    if (grade === "A")

      return "text-sky-400 border-sky-500/30 bg-sky-500/10";

    if (grade === "B")

      return "text-violet-400 border-violet-500/30 bg-violet-500/10";

    if (grade === "C")

      return "text-amber-400 border-amber-500/30 bg-amber-500/10";

    return "text-red-400 border-red-500/30 bg-red-500/10";
  };

  const getFailedSubjects = (r) => {

    return r.marks.filter(
      (m) => Number(m.mark) < 35
    );

  };

  // =====================================================
  // FILTERS
  // =====================================================

  const semesters = [
    ...new Set(
      results.map((r) => r.semester)
    ),
  ].sort((a, b) => a - b);

  const filteredResults = selectedSem

    ? results.filter(
        (r) =>
          Number(r.semester) ===
          Number(selectedSem)
      )

    : results;

  // =====================================================
  // STATS
  // =====================================================

  const overallTotal = results.reduce(
    (sum, r) => sum + getTotal(r),
    0
  );

  const totalSubjects = results.reduce(
    (sum, r) => sum + r.marks.length,
    0
  );

  const overallAvg =

    totalSubjects > 0

      ? (
          overallTotal / totalSubjects
        ).toFixed(2)

      : 0;

  const bestSem =

    results.length > 0

      ? results.reduce((best, curr) =>

          Number(getAverage(curr)) >
          Number(getAverage(best))

            ? curr
            : best
        )

      : null;

  const passedCount = results.filter(
    (r) => getResult(r) === "Pass"
  ).length;

  // =====================================================
  // STAT CARDS
  // =====================================================

  const statCards = [
    {
      label: "Semesters",
      value: results.length,
      text: "text-violet-300",
      border: "border-violet-500/20",
      accent: "from-violet-500/20 to-violet-500/5",
      glow: "bg-violet-400",
    },

    {
      label: "Overall Avg",
      value: `${overallAvg}%`,
      text: "text-emerald-300",
      border: "border-emerald-500/20",
      accent: "from-emerald-500/20 to-emerald-500/5",
      glow: "bg-emerald-400",
    },

    {
      label: "Best Semester",
      value: bestSem
        ? `Sem ${bestSem.semester}`
        : "—",

      sub: bestSem
        ? `${getAverage(bestSem)}% avg`
        : "",

      text: "text-amber-300",
      border: "border-amber-500/20",
      accent: "from-amber-500/20 to-amber-500/5",
      glow: "bg-amber-400",
    },

    {
      label: "Sems Passed",
      value: `${passedCount}/${results.length}`,
      text: "text-sky-300",
      border: "border-sky-500/20",
      accent: "from-sky-500/20 to-sky-500/5",
      glow: "bg-sky-400",
    },
  ];

  return (

    <div className="min-h-screen bg-[#080810] text-white relative overflow-hidden">

      {/* BG */}

      <div className="pointer-events-none fixed top-[-15%] right-[-5%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[100px]" />

      <div className="pointer-events-none fixed bottom-[-10%] left-[5%] w-[400px] h-[400px] rounded-full bg-emerald-500/8 blur-[90px]" />

      <div className="relative z-10 p-4 md:p-8 max-w-5xl mx-auto">

        {/* HEADER */}

        <div className="mb-8">

          <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/25 text-sky-300 text-[11px] font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full mb-3">

            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />

            Student Portal

          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">

            My{" "}

            <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">

              Results

            </span>

          </h1>

          <p className="text-white/40 text-sm mt-1">

            Track your academic performance

          </p>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

          {statCards.map((card) => (

            <div
              key={card.label}
              className={`relative bg-gradient-to-br ${card.accent} border ${card.border} rounded-2xl p-4 overflow-hidden`}
            >

              <p className="text-[10px] font-semibold tracking-widest uppercase text-white/40 mb-2">

                {card.label}

              </p>

              <p
                className={`text-3xl font-extrabold tracking-tight ${card.text}`}
              >

                {card.value}

              </p>

              {card.sub && (

                <p className="text-[11px] text-white/35 mt-1">

                  {card.sub}

                </p>

              )}

              <div
                className={`absolute bottom-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20 ${card.glow}`}
              />

            </div>

          ))}

        </div>

        {/* FILTER */}

        <div className="flex gap-3 flex-wrap mb-8">

          <button
            onClick={() => setSelectedSem("")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-150 ${
              selectedSem === ""
                ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                : "bg-white/5 border-white/10 text-white/45"
            }`}
          >

            All

          </button>

          {semesters.map((sem) => (

            <button
              key={sem}
              onClick={() => setSelectedSem(sem)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-150 ${
                Number(selectedSem) === Number(sem)
                  ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                  : "bg-white/5 border-white/10 text-white/45"
              }`}
            >

              Sem {sem}

            </button>

          ))}

        </div>

        {/* EMPTY */}

        {filteredResults.length === 0 ? (

          <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-14 text-center">

            <p className="text-white/40">

              No Results Found

            </p>

          </div>

        ) : (

          <div className="grid gap-5">

            {filteredResults.map((r) => {

              const avg = getAverage(r);

              const grade = getGrade(avg);

              const isPassed =
                getResult(r) === "Pass";

              const failed =
                getFailedSubjects(r);

              const remark =
                getRemark(avg);

              return (

                <div
                  key={r.id}
                  className="bg-[#111118] border border-white/[0.06] rounded-2xl p-6"
                >

                  {/* HEADER */}

                  <div className="flex justify-between items-center mb-6">

                    <div>

                      <p className="text-[11px] uppercase tracking-widest text-white/35">

                        Academic Record

                      </p>

                      <h2 className="text-2xl font-extrabold">

                        Semester {r.semester}

                      </h2>

                    </div>

                    <div className="flex gap-2">

                      <span
                        className={`px-3 py-1 rounded-xl text-sm font-bold border ${getGradeStyle(
                          grade
                        )}`}
                      >

                        {grade}

                      </span>

                      <span
                        className={`px-3 py-1 rounded-xl text-xs font-semibold border ${
                          isPassed
                            ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                            : "bg-red-500/15 border-red-500/30 text-red-300"
                        }`}
                      >

                        {isPassed
                          ? "Pass"
                          : "Fail"}

                      </span>

                    </div>

                  </div>

                  {/* SUBJECTS */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                    {r.marks.map((m) => (

                      <div
                        key={m.id}
                        className={`rounded-xl p-4 border ${
                          m.mark >= 75
                            ? "bg-emerald-500/10 border-emerald-500/20"
                            : m.mark >= 35
                            ? "bg-white/[0.04] border-white/8"
                            : "bg-red-500/10 border-red-500/20"
                        }`}
                      >

                        <div className="flex justify-between items-center">

                          <div>

                            <p className="text-sm font-semibold">

                              {m.subject_name}

                            </p>

                            <p className="text-xs text-white/40 mt-1">

                              {m.subject_code}

                            </p>

                          </div>

                          <p
                            className={`text-2xl font-extrabold ${
                              m.mark >= 75
                                ? "text-emerald-400"
                                : m.mark >= 35
                                ? "text-white"
                                : "text-red-400"
                            }`}
                          >

                            {m.mark}

                          </p>

                        </div>

                      </div>

                    ))}

                  </div>

                  {/* TOTAL */}

                  <div className="grid grid-cols-3 gap-3 mb-5">

                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center">

                      <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">

                        Total

                      </p>

                      <p className="text-2xl font-extrabold">

                        {getTotal(r)}

                      </p>

                    </div>

                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center">

                      <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">

                        Average

                      </p>

                      <p className="text-2xl font-extrabold text-emerald-400">

                        {avg}%

                      </p>

                    </div>

                    <div
                      className={`rounded-xl p-4 text-center border ${getGradeStyle(
                        grade
                      )}`}
                    >

                      <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1">

                        Grade

                      </p>

                      <p className="text-2xl font-extrabold">

                        {grade}

                      </p>

                    </div>

                  </div>

                  {/* REMARK */}

                  <div className="flex justify-between flex-wrap gap-2">

                    <p
                      className={`font-semibold ${remark.cls}`}
                    >

                      {remark.icon} {remark.text}

                    </p>

                    {failed.length > 0 && (

                      <div className="flex gap-2 flex-wrap">

                        {failed.map((f) => (

                          <span
                            key={f.id}
                            className="text-xs px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400"
                          >

                            {f.subject_name}

                          </span>

                        ))}

                      </div>

                    )}

                  </div>

                </div>

              );
            })}

          </div>

        )}

      </div>

    </div>
  );
}

export default User;
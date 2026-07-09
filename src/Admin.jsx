import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "./api";

function Admin() {

  const token = localStorage.getItem("token") || "";

  const [users, setUsers] = useState([]);
  const [results, setResults] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");

  const [selectedSemesters, setSelectedSemesters] =
    useState({});

  const [form, setForm] = useState({
    user: "",
    semester: "",
    college_code: "",
    marks: {}
  });

  // =========================================
  // LOAD INITIAL DATA
  // =========================================

  useEffect(() => {

    loadUsers();

    fetchResults();

  }, []);

  // =========================================
  // LOAD USERS
  // =========================================

  const loadUsers = () => {

    axios.get(
      `${API_URL}/users/`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    .then((res) => {

      console.log("USERS =", res.data);

      setUsers(res.data);

    })

    .catch((err) => console.log(err));
  };

  // =========================================
  // LOAD RESULTS
  // =========================================

  const fetchResults = () => {

    axios.get(
      `${API_URL}/results/`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    .then((res) => {

      console.log("RESULTS =", res.data);

      setResults(res.data);

    })

    .catch((err) => console.log(err));
  };

  // =========================================
  // LOAD SUBJECTS
  // =========================================

  const loadSubjects = (
    departmentId,
    semester
  ) => {

    if (!departmentId || !semester) {

      setSubjects([]);

      return;
    }

    axios.get(
  `${API_URL}/filtered-subjects/?department=${departmentId}&semester=${semester}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    .then((res) => {

      console.log("SUBJECTS =", res.data);

      setSubjects(res.data);

    })

    .catch((err) => {

      console.log(err);

      setSubjects([]);

    });
  };

  // =========================================
  // USER CHANGE
  // =========================================

  const handleUserChange = (e) => {

    const id = e.target.value;

    const selectedUser = users.find(
      (u) => Number(u.id) === Number(id)
    );

    setForm((prev) => ({
      ...prev,
      user: id,
      college_code:
        selectedUser?.college_code || "",
      marks: {}
    }));

    if (
      selectedUser?.department &&
      form.semester
    ) {

      loadSubjects(
        selectedUser.department,
        form.semester
      );
    }
  };

  // =========================================
  // SEMESTER CHANGE
  // =========================================

  const handleSemesterChange = (e) => {

    const semester = e.target.value;

    const selectedUser = users.find(
      (u) => Number(u.id) === Number(form.user)
    );

    setForm((prev) => ({
      ...prev,
      semester,
      marks: {}
    }));

    if (selectedUser?.department) {

      loadSubjects(
        selectedUser.department,
        semester
      );
    }
  };

  // =========================================
  // MARK CHANGE
  // =========================================

  const handleMarkChange = (
    subjectId,
    value
  ) => {

    setForm((prev) => ({
      ...prev,
      marks: {
        ...prev.marks,
        [subjectId]: value
      }
    }));
  };

  // =========================================
  // RESET FORM
  // =========================================

  const resetForm = () => {

    setEditId(null);

    setSubjects([]);

    setForm({
      user: "",
      semester: "",
      college_code: "",
      marks: {}
    });
  };

  // =========================================
  // SUBMIT
  // =========================================

  const handleSubmit = () => {

    if (!form.user || !form.semester) {

      alert(
        "Select student & semester ❌"
      );

      return;
    }

    if (subjects.length === 0) {

      alert(
        "No subjects found ❌"
      );

      return;
    }

    const marksArray = subjects.map(
      (subject) => ({

        subject: subject.id,

        mark: Number(
          form.marks[subject.id] || 0
        )
      })
    );

    const payload = {

      user: Number(form.user),

      semester: Number(form.semester),

      marks: marksArray
    };

    console.log("PAYLOAD =", payload);

    const api = editId

      ? axios.put(
         `${API_URL}/results/${editId}/`,
          payload,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        )

      : axios.post(
          `${API_URL}/add-result/`,
          payload,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

    api.then(() => {

      alert(
        "Saved Successfully 🔥"
      );

      resetForm();

      fetchResults();

    })

    .catch((err) => {

      console.log(
        "FULL ERROR =",
        err
      );

      console.log(
        "RESPONSE =",
        err.response
      );

      console.log(
        "DATA =",
        err.response?.data
      );

      alert(
        JSON.stringify(
          err.response?.data,
          null,
          2
        )
      );
    });
  };

  // =========================================
  // DELETE
  // =========================================

  const handleDelete = (id) => {

    if (!window.confirm("Delete?"))
      return;

    axios.delete(
      `${API_URL}/results/${id}/delete/`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    )

    .then(() => {

      fetchResults();

    })

    .catch((err) => console.log(err));
  };

  // =========================================
  // EDIT
  // =========================================

  const handleEdit = (row) => {

    setEditId(row.id);

    const marksObj = {};

    row.marks.forEach((m) => {

      marksObj[m.subject] = m.mark;

    });

    const selectedUser = users.find(
      (u) => Number(u.id) === Number(row.user)
    );

    setForm({
      user: row.user,
      semester: row.semester,
      college_code:
        selectedUser?.college_code || "",
      marks: marksObj
    });

    if (selectedUser?.department) {

      loadSubjects(
        selectedUser.department,
        row.semester
      );
    }
  };

  // =========================================
  // STATS
  // =========================================

  const getStats = (row) => {

    const marks = row.marks.map(
      (m) => Number(m.mark)
    );

    const total = marks.reduce(
      (a, b) => a + b,
      0
    );

    const avg =
      marks.length > 0
        ? (
            total / marks.length
          ).toFixed(1)
        : 0;

    const pass = marks.every(
      (m) => m >= 35
    );

    return {
      total,
      avg,
      pass
    };
  };

  // =========================================
  // FILTER
  // =========================================

  const uniqueStudents = users.filter(
    (u) =>
      results.some(
        (r) =>
          Number(r.user) === Number(u.id)
      )
  );

  const filteredStudents =
    uniqueStudents.filter((student) =>
      student.username
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  const getStudentResults = (id) =>
    results.filter(
      (r) =>
        Number(r.user) === Number(id)
    );

  const getSelectedResult = (id) => {

    const list =
      getStudentResults(id);

    if (!list.length) return null;

    const semester =
      selectedSemesters[id] ||
      list[0].semester;

    return list.find(
      (r) =>
        Number(r.semester) ===
        Number(semester)
    );
  };

  return (

    <div className="min-h-screen bg-black text-white p-6">

      {/* FORM */}

      <div className="bg-zinc-900 p-6 rounded-2xl mb-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* STUDENT */}

          <select
            value={form.user}
            onChange={handleUserChange}
            className="bg-zinc-800 p-3 rounded-xl"
          >

            <option value="">
              Select Student
            </option>

            {users.map((u) => (

              <option
                key={u.id}
                value={u.id}
              >

                {u.username}

              </option>

            ))}

          </select>

          {/* COLLEGE CODE */}

          <input
            readOnly
            value={form.college_code}
            placeholder="College Code"
            className="bg-zinc-800 p-3 rounded-xl"
          />

          {/* SEMESTER */}

          <select
            value={form.semester}
            onChange={
              handleSemesterChange
            }
            className="bg-zinc-800 p-3 rounded-xl"
          >

            <option value="">
              Select Semester
            </option>

            {[1,2,3,4,5,6].map((s) => (

              <option
                key={s}
                value={s}
              >

                Semester {s}

              </option>

            ))}

          </select>

        </div>

        {/* SUBJECTS */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

          {subjects.map((subject) => (

            <div
              key={subject.id}
              className="flex flex-col"
            >

              <label className="mb-2 text-sm">

                {subject.subject_name}
                ({subject.subject_code})

              </label>

              <input
                type="number"
                placeholder="Enter mark"
                value={
                  form.marks[
                    subject.id
                  ] || ""
                }
                onChange={(e) =>
                  handleMarkChange(
                    subject.id,
                    e.target.value
                  )
                }
                className="bg-zinc-800 p-3 rounded-xl"
              />

            </div>

          ))}

        </div>

        {/* BUTTON */}

        <button
          onClick={handleSubmit}
          className="bg-violet-600 px-6 py-3 rounded-xl mt-6"
        >

          {editId
            ? "Update Marks"
            : "Add Marks"}

        </button>

      </div>

      {/* SEARCH */}

      <input
        type="text"
        placeholder="Search Student..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="bg-zinc-900 p-3 rounded-xl w-full mb-8"
      />

      {/* RESULTS */}

      <div className="space-y-6">

        {filteredStudents.length === 0 ? (

          <div className="bg-zinc-900 p-6 rounded-2xl text-zinc-400">

            No Results Found

          </div>

        ) : (

          filteredStudents.map((student) => {

            const result =
              getSelectedResult(
                student.id
              );

            if (!result) return null;

            const stats =
              getStats(result);

            return (

              <div
                key={student.id}
                className="bg-zinc-900 p-6 rounded-2xl"
              >

                {/* HEADER */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                  <div>

                    <h2 className="text-xl font-bold">

                      {student.username}

                    </h2>

                    <p className="text-zinc-400">

                      {student.college_code}

                    </p>

                    <p className="text-sm text-violet-400 mt-1">

                      Department :
                      {" "}
                      {student.department_name || "N/A"}

                    </p>

                  </div>

                  <select
                    value={
                      selectedSemesters[
                        student.id
                      ] ||
                      result.semester
                    }
                    onChange={(e) =>
                      setSelectedSemesters({
                        ...selectedSemesters,
                        [student.id]:
                          e.target.value
                      })
                    }
                    className="bg-zinc-800 p-3 rounded-xl"
                  >

                    {getStudentResults(
                      student.id
                    ).map((r) => (

                      <option
                        key={r.id}
                        value={r.semester}
                      >

                        Semester {r.semester}

                      </option>

                    ))}

                  </select>

                </div>

                {/* TABLE */}

                <div className="overflow-x-auto">

                  <table className="w-full">

                    <thead>

                      <tr className="border-b border-zinc-700">

                        <th className="text-left py-3">
                          Subject
                        </th>

                        <th className="text-left py-3">
                          Code
                        </th>

                        <th className="text-left py-3">
                          Mark
                        </th>

                        <th className="text-left py-3">
                          Status
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {result.marks.map((m) => (

                        <tr
                          key={m.id}
                          className="border-b border-zinc-800"
                        >

                          <td className="py-3">
                            {m.subject_name}
                          </td>

                          <td className="py-3">
                            {m.subject_code}
                          </td>

                          <td className="py-3">
                            {m.mark}
                          </td>

                          <td className="py-3">

                            {m.mark >= 35 ? (

                              <span className="text-green-400">
                                PASS
                              </span>

                            ) : (

                              <span className="text-red-400">
                                FAIL
                              </span>

                            )}

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

                {/* STATS */}

                <div className="flex flex-wrap gap-4 mt-6">

                  <div className="bg-zinc-800 px-4 py-2 rounded-xl">

                    Total :
                    {" "}
                    {stats.total}

                  </div>

                  <div className="bg-zinc-800 px-4 py-2 rounded-xl">

                    Average :
                    {" "}
                    {stats.avg}

                  </div>

                  <div className="bg-zinc-800 px-4 py-2 rounded-xl">

                    {stats.pass ? (

                      <span className="text-green-400">
                        PASS
                      </span>

                    ) : (

                      <span className="text-red-400">
                        FAIL
                      </span>

                    )}

                  </div>

                </div>

                {/* ACTIONS */}

                <div className="flex gap-4 mt-6">

                  <button
                    onClick={() =>
                      handleEdit(result)
                    }
                    className="bg-blue-600 px-5 py-2 rounded-xl"
                  >

                    Edit

                  </button>

                  <button
                    onClick={() =>
                      handleDelete(
                        result.id
                      )
                    }
                    className="bg-red-600 px-5 py-2 rounded-xl"
                  >

                    Delete

                  </button>

                </div>

              </div>

            );
          })

        )}

      </div>

    </div>
  );
}

export default Admin;
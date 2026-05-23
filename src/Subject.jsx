import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function Subject() {

  const token = localStorage.getItem("token");

  // =====================================================
  // STATES
  // =====================================================

  const [subjects, setSubjects] = useState([]);

  const [departments, setDepartments] = useState([]);

  const [department, setDepartment] = useState("");

  const [semester, setSemester] = useState("");

  const [subjectCode, setSubjectCode] = useState("");

  const [subjectName, setSubjectName] = useState("");

  const [credits, setCredits] = useState(4);

  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(false);

  // =====================================================
  // FETCH SUBJECTS
  // =====================================================

  const fetchSubjects = async () => {

    try {

      const res = await axios.get(
        "http://127.0.0.1:8000/subjects/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSubjects(res.data);

    } catch (err) {

      console.log(err);

      toast.error("Failed to load subjects ❌");

    }
  };

  // =====================================================
  // FETCH DEPARTMENTS
  // =====================================================

  const fetchDepartments = async () => {

    try {

      const res = await axios.get(
        "http://127.0.0.1:8000/department/"
      );

      setDepartments(res.data);

    } catch (err) {

      console.log(err);

    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchSubjects();

    fetchDepartments();

  }, []);

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {

    setDepartment("");

    setSemester("");

    setSubjectCode("");

    setSubjectName("");

    setCredits(4);

    setEditId(null);

  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async () => {

    if (
      !department ||
      !semester ||
      !subjectCode ||
      !subjectName
    ) {

      toast.error("All fields required ❌");

      return;
    }

    setLoading(true);

    try {

      const data = {

        department,
        semester,
        subject_code: subjectCode,
        subject_name: subjectName,
        credits,
      };

      // =========================================
      // UPDATE
      // =========================================

      if (editId) {

        await axios.put(
          `http://127.0.0.1:8000/subjects/${editId}/`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Subject Updated 🔥");

      }

      // =========================================
      // CREATE
      // =========================================

      else {

        await axios.post(
          "http://127.0.0.1:8000/subjects/",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Subject Added 🔥");

      }

      resetForm();

      fetchSubjects();

    } catch (err) {

      console.log(err);

      toast.error(
        err.response?.data?.error ||
        "Something went wrong ❌"
      );

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Delete Subject?"
    );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `http://127.0.0.1:8000/subjects/${id}/delete/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Subject Deleted 🗑️");

      fetchSubjects();

    } catch (err) {

      console.log(err);

      toast.error("Delete failed ❌");

    }
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (subject) => {

    setEditId(subject.id);

    setDepartment(subject.department);

    setSemester(subject.semester);

    setSubjectCode(subject.subject_code);

    setSubjectName(subject.subject_name);

    setCredits(subject.credits);

  };

  return (

    <div className="min-h-screen text-white">

      {/* ===================================================== */}
      {/* TOP CARD */}
      {/* ===================================================== */}

      <div className="bg-zinc-900 rounded-3xl border border-white/5 p-6 mb-8">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-6">

          <div>

            <h1 className="text-3xl font-bold">
              Subject Management
            </h1>

            <p className="text-white/40 text-sm mt-1">
              Add semester wise subjects
            </p>

          </div>

          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-2xl">

            📚

          </div>

        </div>

        {/* FORM */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

          {/* Department */}

          <select
            value={department}
            onChange={(e) =>
              setDepartment(e.target.value)
            }
            className="bg-zinc-800 border border-white/10 rounded-2xl px-4 py-3 outline-none"
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

          {/* Semester */}

          <select
            value={semester}
            onChange={(e) =>
              setSemester(e.target.value)
            }
            className="bg-zinc-800 border border-white/10 rounded-2xl px-4 py-3 outline-none"
          >

            <option value="">
              Select Semester
            </option>

            {[1,2,3,4,5,6].map((sem) => (

              <option
                key={sem}
                value={sem}
              >
                Semester {sem}
              </option>

            ))}

          </select>

          {/* Credits */}

          <input
            type="number"
            placeholder="Credits"
            value={credits}
            onChange={(e) =>
              setCredits(e.target.value)
            }
            className="bg-zinc-800 border border-white/10 rounded-2xl px-4 py-3 outline-none"
          />

          {/* Subject Code */}

          <input
            type="text"
            placeholder="Subject Code"
            value={subjectCode}
            onChange={(e) =>
              setSubjectCode(e.target.value)
            }
            className="bg-zinc-800 border border-white/10 rounded-2xl px-4 py-3 outline-none"
          />

          {/* Subject Name */}

          <input
            type="text"
            placeholder="Subject Name"
            value={subjectName}
            onChange={(e) =>
              setSubjectName(e.target.value)
            }
            className="bg-zinc-800 border border-white/10 rounded-2xl px-4 py-3 outline-none"
          />

        </div>

        {/* BUTTONS */}

        <div className="flex gap-4 mt-6">

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 transition-all font-semibold"
          >

            {loading
              ? "Saving..."
              : editId
              ? "Update Subject"
              : "Add Subject"}

          </button>

          {editId && (

            <button
              onClick={resetForm}
              className="px-6 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-300"
            >

              Cancel

            </button>

          )}

        </div>

      </div>

      {/* ===================================================== */}
      {/* SUBJECT LIST */}
      {/* ===================================================== */}

      <div className="bg-zinc-900 rounded-3xl border border-white/5 overflow-hidden">

        {/* HEADER */}

        <div className="grid grid-cols-12 px-6 py-4 bg-zinc-800/50 text-sm font-semibold text-white/70">

          <div className="col-span-1">
            ID
          </div>

          <div className="col-span-2">
            Department
          </div>

          <div className="col-span-1">
            Sem
          </div>

          <div className="col-span-2">
            Code
          </div>

          <div className="col-span-3">
            Subject
          </div>

          <div className="col-span-1">
            Credits
          </div>

          <div className="col-span-2 text-right">
            Actions
          </div>

        </div>

        {/* EMPTY */}

        {subjects.length === 0 ? (

          <div className="p-10 text-center text-white/40">

            No Subjects Found

          </div>

        ) : (

          subjects.map((subject) => (

            <div
              key={subject.id}
              className="grid grid-cols-12 items-center px-6 py-5 border-b border-white/5 hover:bg-white/[0.02]"
            >

              <div className="col-span-1 text-white/40">
                #{subject.id}
              </div>

              <div className="col-span-2">
                {subject.department_name}
              </div>

              <div className="col-span-1">
                {subject.semester}
              </div>

              <div className="col-span-2">
                {subject.subject_code}
              </div>

              <div className="col-span-3">
                {subject.subject_name}
              </div>

              <div className="col-span-1">
                {subject.credits}
              </div>

              <div className="col-span-2 flex justify-end gap-3">

                <button
                  onClick={() =>
                    handleEdit(subject)
                  }
                  className="px-4 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300"
                >

                  ✏️ Edit

                </button>

                <button
                  onClick={() =>
                    handleDelete(subject.id)
                  }
                  className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300"
                >

                  🗑️ Delete

                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default Subject;
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import API_URL from "./api";

function Department() {

  const token = localStorage.getItem("token");

  // =====================================================
  // STATES
  // =====================================================

  const [departments, setDepartments] = useState([]);

  const [name, setName] = useState("");

  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(false);

  // =====================================================
  // FETCH DEPARTMENTS
  // =====================================================

  const fetchDepartments = async () => {

    try {

      const res = await axios.get(
        `${API_URL}/department/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDepartments(res.data);

    } catch (err) {

      console.log(err);

      toast.error(
        "Failed to load departments ❌"
      );

    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchDepartments();

  }, []);

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {

    setName("");

    setEditId(null);

  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async () => {

    if (!name.trim()) {

      toast.error(
        "Department name required ❌"
      );

      return;
    }

    setLoading(true);

     console.log("TOKEN =", token);

  console.log("DATA =", {
    name: name.trim(),
  });
  console.log("TOKEN =", token);

console.log("NAME =", name);

console.log("EDIT ID =", editId);
    try {

      // =========================================
      // UPDATE
      // =========================================

      if (editId) {

        await axios.put(
          `${API_URL}/department/${editId}/`,
          {
            name: name.trim(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success(
          "Department Updated 🔥"
        );

      }

      // =========================================
      // CREATE
      // =========================================

      else {

        await axios.post(
          `${API_URL}/department/`,
          {
            name: name.trim(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success(
          "Department Added 🔥"
        );

      }

      resetForm();

      fetchDepartments();

    } catch (err) {

  console.log("FULL ERROR =", err);

  console.log("RESPONSE =", err.response);

  console.log("DATA =", err.response?.data);

  toast.error(
    JSON.stringify(err.response?.data) ||
    "Something went wrong ❌"
  );

}finally {

      setLoading(false);

    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Delete Department?"
    );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `${API_URL}/department/${id}/delete/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Department Deleted 🗑️"
      );

      fetchDepartments();

    } catch (err) {

      console.log(err);

      toast.error(
        "Delete failed ❌"
      );

    }
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (dept) => {

    setEditId(dept.id);

    setName(dept.name);

  };

  return (

    <div className="min-h-screen text-white">

      {/* ===================================================== */}
      {/* TOP CARD */}
      {/* ===================================================== */}

      <div
        className="
          bg-zinc-900
          rounded-3xl
          border
          border-white/5
          p-6
          mb-8
          shadow-2xl
        "
      >

        {/* HEADER */}

        <div className="flex items-center justify-between mb-6">

          <div>

            <h1 className="text-3xl font-bold tracking-tight">

              Department Management

            </h1>

            <p className="text-white/40 text-sm mt-1">

              Add, edit & manage departments

            </p>

          </div>

          <div
            className="
              w-14
              h-14
              rounded-2xl
              bg-violet-500/10
              flex
              items-center
              justify-center
              text-2xl
            "
          >
            🏫
          </div>

        </div>

        {/* FORM */}

        <div className="flex flex-col md:flex-row gap-4">

          <input
            type="text"
            placeholder="Enter Department Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="
              flex-1
              bg-zinc-800
              border
              border-white/10
              rounded-2xl
              px-4
              py-3
              outline-none
              focus:border-violet-500/40
              focus:ring-2
              focus:ring-violet-500/20
              transition-all
            "
          />

          <button
  type="button"
  onClick={() => {
    console.log("BUTTON CLICKED");
    handleSubmit();
  }}
            disabled={loading}
            className="
              px-6
              py-3
              rounded-2xl
              bg-violet-600
              hover:bg-violet-500
              disabled:opacity-50
              font-semibold
              transition-all
              shadow-lg
              hover:scale-[1.02]
            "
          >

            {loading
              ? "Saving..."
              : editId
              ? "Update Department"
              : "Add Department"}

          </button>

          {editId && (

            <button
              onClick={resetForm}
              className="
                px-5
                py-3
                rounded-2xl
                bg-red-500/10
                hover:bg-red-500/20
                text-red-300
                transition-all
              "
            >

              Cancel

            </button>

          )}

        </div>

      </div>

      {/* ===================================================== */}
      {/* DEPARTMENT LIST */}
      {/* ===================================================== */}

      <div
        className="
          bg-zinc-900
          rounded-3xl
          border
          border-white/5
          overflow-hidden
        "
      >

        {/* TABLE HEADER */}

        <div
          className="
            grid
            grid-cols-12
            px-6
            py-4
            bg-zinc-800/50
            border-b
            border-white/5
            text-sm
            font-semibold
            text-white/70
          "
        >

          <div className="col-span-2">

            ID

          </div>

          <div className="col-span-6">

            Department Name

          </div>

          <div className="col-span-4 text-right">

            Actions

          </div>

        </div>

        {/* EMPTY */}

        {departments.length === 0 ? (

          <div className="p-10 text-center text-white/40">

            No Departments Found

          </div>

        ) : (

          departments.map((dept) => (

            <div
              key={dept.id}
              className="
                grid
                grid-cols-12
                items-center
                px-6
                py-5
                border-b
                border-white/5
                hover:bg-white/[0.02]
                transition-all
              "
            >

              {/* ID */}

              <div className="col-span-2 text-white/40">

                #{dept.id}

              </div>

              {/* NAME */}

              <div className="col-span-6 font-medium text-lg">

                {dept.name}

              </div>

              {/* ACTIONS */}

              <div
                className="
                  col-span-4
                  flex
                  justify-end
                  gap-3
                "
              >

                {/* EDIT */}

                <button
                  onClick={() =>
                    handleEdit(dept)
                  }
                  className="
                    px-4
                    py-2
                    rounded-xl
                    bg-blue-500/10
                    hover:bg-blue-500/20
                    text-blue-300
                    transition-all
                  "
                >

                  ✏️ Edit

                </button>

                {/* DELETE */}

                <button
                  onClick={() =>
                    handleDelete(dept.id)
                  }
                  className="
                    px-4
                    py-2
                    rounded-xl
                    bg-red-500/10
                    hover:bg-red-500/20
                    text-red-300
                    transition-all
                  "
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

export default Department;
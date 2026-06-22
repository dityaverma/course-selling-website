import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCourses = () => {
    setLoading(true);
    api
      .get("/courses")
      .then(({ data }) => setCourses(data))
      .catch(() => setError("Failed to load courses."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      await api.delete(`/courses/delete/${id}`);
      setCourses((prev) => prev.filter((c) => c._id !== id));
      setDeleteId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="min-h-screen">
      <div className="border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="section-label mb-2">Admin</p>
              <h1 className="text-4xl md:text-5xl">Course Management</h1>
            </div>
            <Link to="/admin/create" className="btn-primary py-3 px-6 text-sm self-start sm:self-auto">
              + New Course
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {error && (
          <div className="mb-6 border border-black bg-zinc-50 px-5 py-4 text-sm max-w-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-zinc-100 animate-pulse" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="border border-dashed border-zinc-300 py-24 text-center">
            <p className="text-zinc-400 text-sm mb-4">No courses published yet.</p>
            <Link to="/admin/create" className="btn-primary py-3 px-6 text-sm">
              Create your first course
            </Link>
          </div>
        ) : (
          <>
            <p className="text-xs text-zinc-400 mb-4">
              {courses.length} course{courses.length !== 1 ? "s" : ""} total
            </p>
            <div className="border border-zinc-200 divide-y divide-zinc-100">
              {/* Table header */}
              <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-zinc-50 text-xs font-medium tracking-widest uppercase text-zinc-500">
                <div className="col-span-5">Title</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-right">Students</div>
                <div className="col-span-3 text-right">Actions</div>
              </div>

              {courses.map((course) => (
                <div
                  key={course._id}
                  className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-zinc-50 transition-colors"
                >
                  <div className="col-span-5">
                    <p className="text-sm font-medium truncate">{course.title}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      by {course.creator?.name || "Unknown"}
                    </p>
                  </div>
                  <div className="col-span-2 text-right text-sm font-medium">
                    {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
                  </div>
                  <div className="col-span-2 text-right text-sm text-zinc-500">
                    {course.studentsEnrolled?.length || 0}
                  </div>
                  <div className="col-span-3 flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/edit/${course._id}`}
                      className="text-xs border border-zinc-300 px-3 py-1.5 hover:border-black transition-colors"
                    >
                      Edit
                    </Link>
                    {deleteId === course._id ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDelete(course._id)}
                          disabled={deleting}
                          className="text-xs bg-black text-white px-3 py-1.5 hover:bg-zinc-800 disabled:opacity-50"
                        >
                          {deleting ? "…" : "Confirm"}
                        </button>
                        <button
                          onClick={() => setDeleteId(null)}
                          className="text-xs border border-zinc-300 px-3 py-1.5 hover:border-black"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteId(course._id)}
                        className="text-xs border border-zinc-300 px-3 py-1.5 hover:border-black hover:text-black transition-colors text-zinc-500"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default AdminDashboard;

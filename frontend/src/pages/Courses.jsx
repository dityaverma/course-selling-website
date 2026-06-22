import { useEffect, useState } from "react";
import api from "../api/axios";
import CourseCard from "../components/CourseCard";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/courses")
      .then(({ data }) => setCourses(data))
      .catch(() => setError("Failed to load courses. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <p className="section-label mb-2">Browse all</p>
          <h1 className="text-4xl md:text-5xl mb-6">Courses</h1>
          <div className="max-w-md">
            <input
              type="text"
              placeholder="Search courses…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border border-zinc-100 animate-pulse">
                <div className="aspect-video bg-zinc-100" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-zinc-100 rounded w-3/4" />
                  <div className="h-3 bg-zinc-100 rounded" />
                  <div className="h-3 bg-zinc-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="border border-black bg-zinc-50 px-5 py-4 text-sm max-w-sm">
            {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="border border-dashed border-zinc-300 py-24 text-center">
            <p className="text-zinc-400 text-sm mb-2">
              {search ? `No courses match "${search}"` : "No courses available yet."}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-xs underline underline-offset-4 text-zinc-500 hover:text-black"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            <p className="text-xs text-zinc-400 mb-5">
              {filtered.length} course{filtered.length !== 1 ? "s" : ""}
              {search && ` matching "${search}"`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Courses;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/courses/my-courses")
      .then(({ data }) => setCourses(data))
      .catch(() => setError("Failed to load your courses."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen">
      <div className="border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <p className="section-label mb-2">Your library</p>
          <h1 className="text-4xl md:text-5xl">My Courses</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-zinc-100 animate-pulse">
                <div className="aspect-video bg-zinc-100" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-zinc-100 rounded w-3/4" />
                  <div className="h-3 bg-zinc-100 rounded" />
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

        {!loading && !error && courses.length === 0 && (
          <div className="border border-dashed border-zinc-300 py-24 text-center">
            <p className="text-zinc-400 text-sm mb-4">You haven't enrolled in any courses yet.</p>
            <Link to="/courses" className="btn-primary py-3 px-6 text-sm">
              Browse courses
            </Link>
          </div>
        )}

        {!loading && !error && courses.length > 0 && (
          <>
            <p className="text-xs text-zinc-400 mb-6">
              {courses.length} course{courses.length !== 1 ? "s" : ""} in your library
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="border border-zinc-200 hover:border-black transition-all duration-200 group"
                >
                  <div className="aspect-video overflow-hidden bg-zinc-100">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/600x400/000000/FFFFFF?text=Course";
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <div className="inline-block bg-black text-white text-xs px-2 py-0.5 mb-2 font-medium">
                      ENROLLED
                    </div>
                    <h3 className="font-semibold text-sm leading-snug mb-2">{course.title}</h3>
                    <p className="text-xs text-zinc-500 line-clamp-2 mb-3">
                      {course.description}
                    </p>
                    <Link
                      to={`/courses/${course._id}`}
                      className="text-xs font-medium underline underline-offset-4 hover:text-zinc-600"
                    >
                      View course →
                    </Link>
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

export default MyCourses;

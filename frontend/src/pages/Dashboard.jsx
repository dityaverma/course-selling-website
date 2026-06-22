import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();

  const purchasedCount = user?.purchasedCourses?.length || 0;

  return (
    <main className="min-h-screen">
      <div className="border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <p className="section-label mb-2">Your account</p>
          <h1 className="text-4xl">
            Welcome back,{" "}
            <span className="italic">{user?.name?.split(" ")[0]}</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile card */}
          <div className="lg:col-span-1">
            <div className="border border-zinc-200 p-6">
              <div className="w-14 h-14 bg-black text-white flex items-center justify-center text-xl font-bold mb-4">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <h2 className="text-lg font-semibold mb-1">{user?.name}</h2>
              <p className="text-sm text-zinc-500 mb-4">{user?.email}</p>
              <div className="inline-block border border-zinc-300 px-3 py-1 text-xs font-medium tracking-wide uppercase">
                {user?.role === "admin" ? "Instructor" : "Student"}
              </div>

              <div className="border-t border-zinc-100 mt-5 pt-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Member since</span>
                  <span className="font-medium">
                    {new Date(user?.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Courses purchased</span>
                  <span className="font-medium">{purchasedCount}</span>
                </div>
              </div>

              {user?.role === "admin" && (
                <div className="mt-5">
                  <Link to="/admin" className="btn-primary w-full text-center block py-3 text-sm">
                    Admin Dashboard →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="lg:col-span-2 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-zinc-200 p-6">
                <p className="section-label mb-2">Courses</p>
                <div className="text-4xl font-bold">{purchasedCount}</div>
                <p className="text-xs text-zinc-500 mt-1">enrolled</p>
              </div>
              <div className="border border-zinc-200 p-6">
                <p className="section-label mb-2">Hours</p>
                <div className="text-4xl font-bold">{purchasedCount * 8}+</div>
                <p className="text-xs text-zinc-500 mt-1">of content</p>
              </div>
            </div>

            {/* Recent courses */}
            <div className="border border-zinc-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">Your Courses</h3>
                <Link
                  to="/my-courses"
                  className="text-xs underline underline-offset-4 text-zinc-500 hover:text-black"
                >
                  View all
                </Link>
              </div>

              {purchasedCount === 0 ? (
                <div className="border border-dashed border-zinc-200 py-8 text-center">
                  <p className="text-zinc-400 text-sm mb-3">No courses yet.</p>
                  <Link
                    to="/courses"
                    className="text-xs font-medium underline underline-offset-4 hover:text-zinc-600"
                  >
                    Browse courses →
                  </Link>
                </div>
              ) : (
                <ul className="space-y-3">
                  {user.purchasedCourses.slice(0, 3).map((course) => {
                    const c = typeof course === "object" ? course : { _id: course, title: "Course" };
                    return (
                      <li
                        key={c._id}
                        className="flex items-center justify-between text-sm border-b border-zinc-100 pb-3 last:border-0 last:pb-0"
                      >
                        <span className="font-medium truncate max-w-[240px]">
                          {c.title || "Course"}
                        </span>
                        <Link
                          to={`/courses/${c._id}`}
                          className="text-xs text-zinc-400 hover:text-black shrink-0 ml-4"
                        >
                          View →
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="border border-zinc-200 p-6">
              <h3 className="font-semibold text-sm mb-4">Explore More</h3>
              <p className="text-sm text-zinc-500 mb-4">
                Discover new topics and continue building your skills.
              </p>
              <Link to="/courses" className="btn-outline py-2.5 px-5 text-sm">
                Browse all courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;

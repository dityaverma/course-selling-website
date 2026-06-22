import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import CourseCard from "../components/CourseCard";

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    api
      .get("/courses")
      .then(({ data }) => setFeatured(data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoadingCourses(false));
  }, []);

  return (
    <main>
      {/* Hero */}
      <section className="border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-3xl">
            <p className="section-label mb-4">Online Learning Platform</p>
            <h1 className="text-5xl md:text-7xl leading-[1.05] mb-6">
              Master Any Skill.
              <br />
              <span className="italic">On Your Terms.</span>
            </h1>
            <p className="text-zinc-500 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
              Thousands of courses built by experts. Learn at your own pace,
              earn real skills, and advance your career.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/courses" className="btn-primary py-4 px-8 text-base text-center">
                Browse Courses
              </Link>
              <Link to="/signup" className="btn-outline py-4 px-8 text-base text-center">
                Start for Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-zinc-200 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 divide-x divide-zinc-200">
            {[
              { label: "Courses Available", value: "500+" },
              { label: "Active Students", value: "24k" },
              { label: "Expert Instructors", value: "120+" },
            ].map((stat) => (
              <div key={stat.label} className="px-6 first:pl-0 last:pr-0 text-center">
                <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs text-zinc-500 tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="section-label mb-2">Handpicked for you</p>
              <h2 className="text-3xl md:text-4xl">Featured Courses</h2>
            </div>
            <Link
              to="/courses"
              className="text-sm font-medium underline underline-offset-4 hidden sm:block hover:text-zinc-600"
            >
              View all →
            </Link>
          </div>

          {loadingCourses ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-zinc-100 animate-pulse">
                  <div className="aspect-video bg-zinc-100" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-zinc-100 rounded w-3/4" />
                    <div className="h-3 bg-zinc-100 rounded w-full" />
                    <div className="h-3 bg-zinc-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-zinc-300 py-16 text-center">
              <p className="text-zinc-400 text-sm">No courses published yet.</p>
            </div>
          )}

          <div className="mt-8 sm:hidden">
            <Link to="/courses" className="btn-outline w-full text-center block py-3">
              View all courses →
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-zinc-200 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <p className="section-label mb-3">What you'll learn</p>
          <h2 className="text-3xl md:text-4xl mb-10">Top Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              "Web Development",
              "Data Science",
              "Design",
              "Business",
              "Photography",
              "Marketing",
            ].map((cat) => (
              <Link
                key={cat}
                to="/courses"
                className="border border-zinc-300 bg-white p-4 text-sm font-medium text-center hover:border-black hover:bg-black hover:text-white transition-all duration-200"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <p className="section-label text-zinc-400 mb-4">Join thousands of learners</p>
          <h2 className="text-4xl md:text-5xl mb-6 text-white">
            Your next chapter
            <br />
            starts today.
          </h2>
          <p className="text-zinc-400 mb-10 max-w-md mx-auto">
            Sign up free and get instant access to hundreds of courses from
            world-class instructors.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-white text-black px-8 py-4 font-semibold text-sm tracking-wide hover:bg-zinc-100 transition-colors duration-200"
          >
            Get started for free
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;

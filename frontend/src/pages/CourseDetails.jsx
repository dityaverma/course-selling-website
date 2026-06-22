import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    api
      .get(`/courses/${id}`)
      .then(({ data }) => setCourse(data))
      .catch(() => navigate("/courses"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const alreadyPurchased = user?.purchasedCourses?.some(
    (c) => (typeof c === "object" ? c._id : c) === id
  );

  const handleBuy = async () => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: `/courses/${id}` } } });
      return;
    }
    try {
      setBuying(true);
      await api.post(`/courses/buy/${id}`);
      await refreshUser();
      setMessage({ type: "success", text: "Course purchased! Head to your dashboard." });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!course) return null;

  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Back link */}
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-black mb-8 transition-colors"
        >
          ← Back to courses
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
          {/* Main content */}
          <div className="lg:col-span-3">
            <p className="section-label mb-3">Course</p>
            <h1 className="text-3xl md:text-4xl leading-tight mb-4">{course.title}</h1>

            {course.creator?.name && (
              <p className="text-sm text-zinc-500 mb-6">
                Taught by{" "}
                <span className="text-black font-medium">{course.creator.name}</span>
              </p>
            )}

            <div className="flex items-center gap-5 text-sm text-zinc-500 mb-8">
              <span>
                <strong className="text-black">{course.studentsEnrolled?.length || 0}</strong>{" "}
                students enrolled
              </span>
            </div>

            <div className="border-t border-zinc-200 pt-8">
              <h2 className="text-lg font-semibold mb-3">About this course</h2>
              <p className="text-zinc-600 leading-relaxed">{course.description}</p>
            </div>

            {/* What you'll learn */}
            <div className="border-t border-zinc-200 pt-8 mt-8">
              <h2 className="text-lg font-semibold mb-4">What you'll learn</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Practical, job-ready skills",
                  "Real-world project experience",
                  "Best practices and standards",
                  "Expert-curated curriculum",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm text-zinc-600">
                    <span className="mt-0.5 w-4 h-4 border border-black flex items-center justify-center text-xs flex-shrink-0">
                      ✓
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Purchase card */}
          <div className="lg:col-span-2">
            <div className="border border-zinc-200 card-shadow sticky top-24">
              <div className="aspect-video overflow-hidden bg-zinc-100">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/600x400/000000/FFFFFF?text=Course";
                  }}
                />
              </div>
              <div className="p-6">
                <div className="text-3xl font-bold mb-5">
                  {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
                </div>

                {message.text && (
                  <div
                    className={`mb-4 px-4 py-3 text-sm border ${
                      message.type === "success"
                        ? "border-black bg-zinc-50"
                        : "border-black bg-zinc-50"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                {alreadyPurchased ? (
                  <div className="space-y-3">
                    <div className="border border-black bg-zinc-50 px-4 py-3 text-sm text-center font-medium">
                      ✓ Enrolled
                    </div>
                    <Link
                      to="/my-courses"
                      className="btn-outline w-full text-center block py-3"
                    >
                      Go to my courses
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleBuy}
                    disabled={buying}
                    className="btn-primary w-full py-3.5 text-center"
                  >
                    {buying
                      ? "Processing…"
                      : user
                      ? course.price === 0
                        ? "Enroll for free"
                        : "Buy now"
                      : "Sign in to enroll"}
                  </button>
                )}

                <ul className="mt-5 space-y-2 text-xs text-zinc-500">
                  <li>✓ Full lifetime access</li>
                  <li>✓ Access on all devices</li>
                  <li>✓ Certificate of completion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CourseDetails;

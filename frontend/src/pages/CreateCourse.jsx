import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../api/axios";

const CreateCourse = () => {
  const { id } = useParams(); // present when editing
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/courses/${id}`)
      .then(({ data }) => {
        setForm({
          title: data.title,
          description: data.description,
          price: data.price.toString(),
          image: data.image || "",
        });
      })
      .catch(() => setError("Failed to load course data."))
      .finally(() => setFetchLoading(false));
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || form.price === "") {
      setError("Title, description, and price are required.");
      return;
    }
    const price = parseFloat(form.price);
    if (isNaN(price) || price < 0) {
      setError("Price must be a valid non-negative number.");
      return;
    }

    try {
      setLoading(true);
      const payload = { ...form, price };

      if (isEdit) {
        await api.put(`/courses/update/${id}`, payload);
        setSuccess("Course updated successfully.");
      } else {
        await api.post("/courses/create", payload);
        setSuccess("Course created successfully.");
        setForm({ title: "", description: "", price: "", image: "" });
      }

      setTimeout(() => navigate("/admin"), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="border-b border-zinc-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-black mb-6 transition-colors"
          >
            ← Back to admin
          </Link>
          <p className="section-label mb-2">{isEdit ? "Edit" : "New"} course</p>
          <h1 className="text-4xl">{isEdit ? "Update Course" : "Create Course"}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {error && (
          <div className="mb-6 border border-black bg-zinc-50 px-5 py-4 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 border border-black bg-black text-white px-5 py-4 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-medium mb-1.5 tracking-wide">
              Course Title *
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. Complete React Developer Bootcamp"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 tracking-wide">
              Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              className="input-field resize-none"
              placeholder="Describe what students will learn in this course…"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium mb-1.5 tracking-wide">
                Price (USD) *
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="input-field"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              <p className="text-xs text-zinc-400 mt-1">Set to 0 for a free course.</p>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 tracking-wide">
                Cover Image URL
              </label>
              <input
                type="url"
                name="image"
                value={form.image}
                onChange={handleChange}
                className="input-field"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Image preview */}
          {form.image && (
            <div>
              <p className="text-xs text-zinc-400 mb-2">Preview</p>
              <div className="aspect-video max-w-xs overflow-hidden border border-zinc-200 bg-zinc-100">
                <img
                  src={form.image}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/600x400/000000/FFFFFF?text=Invalid+URL";
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-3.5 px-8"
            >
              {loading
                ? isEdit
                  ? "Saving…"
                  : "Creating…"
                : isEdit
                ? "Save changes"
                : "Create course"}
            </button>
            <Link to="/admin" className="btn-outline py-3.5 px-8">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateCourse;

"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ProtectedRoute } from "../../comman/RouteGuards";
import { apiFetch, apiImageUrl } from "../../lib/api";
import { PencilLine, Trash2, Save, X } from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  image: string;
}

function ManagePostsContent() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await apiFetch("/api/posts");
      const data = await response.json();

      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;

    try {
      setSavingId(id);
      const response = await apiFetch(`/api/posts/${id}`, {
        method: "DELETE",
        auth: true,
      });
      const data = await response.json();

      if (data.success) {
        setBlogs((current) => current.filter((blog) => blog._id !== id));
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setSavingId(null);
    }
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingBlog) return;

    try {
      setSavingId(editingBlog._id);

      const form = e.currentTarget;
      const formData = new FormData();
      formData.append(
        "title",
        (form.elements.namedItem("title") as HTMLInputElement).value
      );
      formData.append(
        "description",
        (form.elements.namedItem("description") as HTMLTextAreaElement).value
      );
      formData.append(
        "category",
        (form.elements.namedItem("category") as HTMLSelectElement).value
      );
      formData.append(
        "readTime",
        (form.elements.namedItem("readTime") as HTMLInputElement).value
      );

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await apiFetch(`/api/posts/${editingBlog._id}`, {
        method: "PUT",
        auth: true,
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setBlogs((current) =>
          current.map((blog) =>
            blog._id === editingBlog._id ? data.blog : blog
          )
        );
        setEditingBlog(null);
        setImageFile(null);
      } else {
        alert(data.message || "Update failed");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-white/90 p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-500">
          CRUD Center
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
          Manage Posts
        </h1>
      </section>

      {editingBlog && (
        <form
          onSubmit={handleUpdate}
          className="rounded-[2rem] border border-orange-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-950">Edit Post</h2>
            <button
              type="button"
              onClick={() => {
                setEditingBlog(null);
                setImageFile(null);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
            >
              <X size={16} />
              Cancel
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="title"
              defaultValue={editingBlog.title}
              className="rounded-2xl border border-slate-200 px-4 py-3 focus:border-orange-500 focus:outline-none"
            />
            <input
              name="readTime"
              defaultValue={editingBlog.readTime}
              className="rounded-2xl border border-slate-200 px-4 py-3 focus:border-orange-500 focus:outline-none"
            />
            <select
              name="category"
              defaultValue={editingBlog.category}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 focus:border-orange-500 focus:outline-none"
            >
              <option value="TECHNOLOGY">Technology</option>
              <option value="LIFESTYLE">Lifestyle</option>
              <option value="DESIGN">Design</option>
              <option value="POPULAR">Popular</option>
            </select>
            <label className="rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500">
              {imageFile ? imageFile.name : "Choose a new image (optional)"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          <textarea
            name="description"
            defaultValue={editingBlog.description}
            rows={6}
            className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-orange-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={savingId === editingBlog._id}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
          >
            <Save size={16} />
            {savingId === editingBlog._id ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-500">
          Loading posts...
        </div>
      ) : (
        <div className="grid gap-6">
          {blogs.map((blog) => (
            <article
              key={blog._id}
              className="grid gap-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[220px_1fr]"
            >
              <img
                src={apiImageUrl(`/uploads/${blog.image}`)}
                alt={blog.title}
                className="h-56 w-full rounded-2xl object-cover md:h-full"
              />
              <div className="flex flex-col justify-between gap-4">
                <div>
                  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
                    {blog.category}
                  </span>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950">
                    {blog.title}
                  </h2>
                  <p className="mt-3 line-clamp-4 text-slate-600">
                    {blog.description}
                  </p>
                  <p className="mt-3 text-sm text-slate-400">{blog.readTime}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBlog(blog);
                      setImageFile(null);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-orange-400 hover:text-orange-500"
                  >
                    <PencilLine size={16} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(blog._id)}
                    disabled={savingId === blog._id}
                    className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 size={16} />
                    {savingId === blog._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ManagePostsPage() {
  return (
    <ProtectedRoute>
      <ManagePostsContent />
    </ProtectedRoute>
  );
}

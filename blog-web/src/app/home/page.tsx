"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "../../comman/RouteGuards";
import { apiFetch, apiImageUrl } from "../../lib/api";
import { PencilLine, Trash2 } from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  image: string;
}

function HomeContent() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-white/90 p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-500">
              Dashboard
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
              Latest Blogs
            </h1>
           
          </div>
          <Link
            href="/create-blog"
            className="inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
          >
            Create New Post
          </Link>
        </div>
      </section>

      {loading ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-500">
          Loading posts...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {blogs.map((blog) => (
            <article
              key={blog._id}
              className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition-transform hover:-translate-y-1"
            >
              <img
                src={apiImageUrl(`/uploads/${blog.image}`)}
                alt={blog.title}
                className="h-56 w-full object-cover"
              />
              <div className="p-6">
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
                  {blog.category}
                </span>
                <h2 className="mt-3 text-xl font-bold text-slate-950">
                  {blog.title}
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                  {blog.description}
                </p>
                <div className="mt-5 flex items-center justify-between text-sm text-slate-400">
                  <span>{blog.readTime}</span>
                  <Link
                    href="/manage-posts"
                    className="font-semibold text-orange-500 hover:text-orange-600"
                  >
                    <PencilLine size={16} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  );
}

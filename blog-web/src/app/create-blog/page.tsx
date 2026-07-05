"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Send, X, Type, AlignLeft, Tag } from "lucide-react";
import { ProtectedRoute } from "../../comman/RouteGuards";
import { apiFetch } from "../../lib/api";

function CreateBlogContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      const form = event.currentTarget;

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

      const response = await apiFetch("/api/posts/create", {
        method: "POST",
        auth: true,
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert("Blog uploaded successfully!");
        form.reset();
        setPreview(null);
        setImageFile(null);
        router.push("/manage-posts");
      } else {
        alert(data.message || "Failed to upload blog");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="rounded-t-[2rem] bg-slate-950 p-8 text-white">
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <p className="mt-2 text-slate-400">Share your thoughts with the world.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-8">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <Camera size={18} />
            Cover Image
          </label>

          <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-colors hover:border-orange-400">
            {preview ? (
              <>
                <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    setImageFile(null);
                  }}
                  className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-red-500 shadow-md hover:bg-red-50"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <label className="flex cursor-pointer flex-col items-center">
                <Camera
                  size={40}
                  className="mb-2 text-slate-300 group-hover:text-orange-400"
                />
                <span className="text-sm text-slate-500">Click to upload cover photo</span>
                <input
                  type="file"
                  name="image"
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/*"
                  required
                />
              </label>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <Type size={18} />
            Blog Title
          </label>
          <input
            name="title"
            type="text"
            placeholder="Enter a catchy title..."
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-lg font-semibold focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <Tag size={18} />
              Category
            </label>
            <select
              name="category"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              required
            >
              <option value="TECHNOLOGY">Technology</option>
              <option value="LIFESTYLE">Lifestyle</option>
              <option value="DESIGN">Design</option>
              <option value="POPULAR">Popular</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <AlignLeft size={18} />
              Estimated Read Time
            </label>
            <input
              name="readTime"
              type="text"
              placeholder="e.g. 5 min read"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <AlignLeft size={18} />
            Description / Content
          </label>
          <textarea
            name="description"
            rows={6}
            placeholder="Tell your story..."
            className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-bold text-white shadow-lg transition-all ${
            loading
              ? "cursor-not-allowed bg-slate-400"
              : "bg-orange-500 hover:bg-orange-600 active:scale-[0.99]"
          }`}
        >
          {loading ? "Publishing..." : (
            <>
              <Send size={20} />
              Publish Blog Post
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function CreateBlogPage() {
  return (
    <ProtectedRoute>
      <CreateBlogContent />
    </ProtectedRoute>
  );
}

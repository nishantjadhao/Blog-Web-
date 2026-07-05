const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");
const auth = require("../middleware/auth");

const Blog = require("../models/Blog");

// Create Blog Route
router.post(
  "/create",
  auth,
  upload.single("image"),
  async (req, res) => {

    try {

      const {
        title,
        description,
        category,
        readTime,
      } = req.body;

      if (!req.file) {

        return res.status(400).json({
          success: false,
          message: "Image is required",
        });
      }

      const newBlog = new Blog({
        title,
        description,
        category,
        readTime,
        image: req.file.filename,
      });

      await newBlog.save();

      res.status(201).json({
        success: true,
        message: "Blog Created Successfully",
        blog: newBlog,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);


// Get All Blogs
router.get("/", async (req, res) => {

  try {

    const blogs = await Blog.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      blogs,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// Get Single Blog
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// Update Blog
router.put(
  "/:id",
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, description, category, readTime } = req.body;
      const blog = await Blog.findById(req.params.id);

      if (!blog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found",
        });
      }

      blog.title = title ?? blog.title;
      blog.description = description ?? blog.description;
      blog.category = category ?? blog.category;
      blog.readTime = readTime ?? blog.readTime;

      if (req.file) {
        blog.image = req.file.filename;
      }

      await blog.save();

      res.status(200).json({
        success: true,
        message: "Blog Updated Successfully",
        blog,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);

// Delete Blog
router.delete("/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});


module.exports = router;

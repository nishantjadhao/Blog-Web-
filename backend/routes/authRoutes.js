const express = require("express");

const router = express.Router();

const { loginUser, signupUser, meUser } = require("../controllers/authController");
const auth = require("../middleware/auth");

router.post("/login", loginUser);

router.post("/signup", signupUser);

router.get("/me", auth, meUser);

module.exports = router;

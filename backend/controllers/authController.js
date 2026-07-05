const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createToken = (userId) => {
    const secret = process.env.JWT_SECRET || "SECRET_KEY";

    return jwt.sign(
        { id: userId },
        secret,
        { expiresIn: "7d" }
    );
};

const sanitizeUser = (user) => ({
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});


// SIGNUP
const signupUser = async (req, res) => {

    try {

        const { fullName, email, password } = req.body;

        // Check Existing User
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User Already Exists",
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
        });

        // Generate Token
        const token = createToken(user._id);

        res.status(201).json({
            message: "Signup Successful",
            token,
            user: sanitizeUser(user),
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};


// LOGIN
const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        // Check User
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User Not Found",
            });
        }

        // Compare Password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid Credentials",
            });
        }

        // Generate Token
        const token = createToken(user._id);

        res.status(200).json({
            message: "Login Successful",
            token,
            user: sanitizeUser(user),
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

const meUser = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: sanitizeUser(req.user),
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};


module.exports = {
    signupUser,
    loginUser,
    meUser,
};

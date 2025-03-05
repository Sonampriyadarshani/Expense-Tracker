const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

// ✅ Login Controller
const loginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        // ✅ Find user by email in MySQL
        const user = await UserModel.findByEmail(email);
        if (!user || !user.password) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Check password with bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // ✅ Generate JWT Token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            token, // Send token to client
            user: { id: user.id, name: user.name, email: user.email },
        });

    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message || error,
        });
    }
};

// ✅ Register Controller
const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // ✅ Check for missing fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ✅ Check if the user already exists in MySQL
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // ✅ Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Create a new user in MySQL
        const userId = await UserModel.createUser(name, email, hashedPassword);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: { id: userId, name, email },
        });

    } catch (error) {
        console.error("❌ Registration Error:", error);
        res.status(500).json({
            success: false,
            message: "Registration failed",
            error: error.message || error,
        });
    }
};

module.exports = { loginController, registerController };

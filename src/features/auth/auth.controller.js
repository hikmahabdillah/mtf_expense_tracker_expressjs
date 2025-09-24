// controllers/auth.controller.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator"; // 🔥 ini wajib ditambahkan
import {
  findUserByEmail,
  createUser,
  validatePassword,
  getAllUsers,
} from "./user.model.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, password, confirmPassword } = req.body;

    if (!fullname || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required (fullname, email, password, confirmPassword)",
      });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res
        .status(400)
        .json({ success: false, message: passwordValidation.message });
    }

    const sanitizedEmail = validator.normalizeEmail(email.trim());
    if (!sanitizedEmail || !validator.isEmail(sanitizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    const sanitizedFullname = validator.escape(fullname.trim());
    if (sanitizedFullname.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Full name must be at least 2 characters long",
      });
    }

    const existingUser = await findUserByEmail(sanitizedEmail);
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await createUser({
      fullname: sanitizedFullname,
      email: sanitizedEmail,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser.id,
        fullname: newUser.fullname,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error); // 🔥 debug error asli di terminal
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

export const getRegisteredUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({ success: true, users });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res
      .status(500)
      .json({ message: "Server error occurred", error: err.message });
  }
};

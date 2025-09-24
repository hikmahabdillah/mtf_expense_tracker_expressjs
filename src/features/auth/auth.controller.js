import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "./user.model.js";

export const register = (req, res) => {
  // Registration logic here
  res.send("Register endpoint");
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
    res
      .status(500)
      .json({ message: "Server error occurred", error: err.message });
  }
};

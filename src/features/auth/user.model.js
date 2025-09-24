// models/user.model.js
import { prisma } from "../../core/config/db.js";

export const findUserByEmail = async (email) =>
  await prisma.user.findUnique({ where: { email } });

export const createUser = async (data) => {
  try {
    const user = await prisma.user.create({
      data: {
        fullname: data.fullname,
        email: data.email,
        password: data.password,
      },
      select: {
        id: true,
        fullname: true,
        email: true,
      },
    });
    return user;
  } catch (error) {
    throw error;
  }
};

export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long",
    };
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }
  if (!/(?=.*\d)/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number",
    };
  }
  return { isValid: true };
};

export const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullname: true,
        email: true,
   
      },
    });
    return users;
  } catch (error) {
    throw error;
  }
};

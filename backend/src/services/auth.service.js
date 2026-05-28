const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const register = async (name, email, password) => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user._id);

    return {
      accessToken: token,
      message: "Account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("Register Service Error:", error);
    throw error;
  }
};

const login = async (email, password) => {
  try {
    // Find user and explicitly select password
    const user = await User.findOne({ email }).select("+password");
    
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    const token = generateToken(user._id);

    return {
      accessToken: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("Login Service Error:", error);
    throw error;
  }
};

const getProfile = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    console.error("Get Profile Service Error:", error);
    throw error;
  }
};

const updateProfile = async (userId, updateData) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select("-password");

    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    console.error("Update Profile Service Error:", error);
    throw error;
  }
};

module.exports = { register, login, getProfile, updateProfile };
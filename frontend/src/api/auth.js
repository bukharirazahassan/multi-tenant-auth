import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // Base API URL

// Login function
export const loginUser = async (email, password) => {
  try {
    const { data } = await axios.post(`${API_URL}/login`, { email, password });

    return {
      success: true,
      token: data.token,
      message: data.message,
      user: data.user || null, // ✅ Include `user` object
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Login failed. Please try again.",
    };
  }
};

// Register function
export const registerUser = async ({ fullName, email, password, tenantId = 1, role = "user" }) => {
  try {
    const { data } = await axios.post(`${API_URL}/register`, {
      fullName,
      email,
      password,
      tenantId, // ✅ Ensure this is sent
      role, // ✅ Ensure this is sent
    });

    return { success: true, message: data.message, token: data.token };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || "Registration failed" };
  }
};

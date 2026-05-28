import api from "../lib/axios";

const authService = {
  async register(data) {
    // data: { name, email, password }
    const res = await api.post("/auth/register", data);
    return res.data; // { success, accessToken, user }
  },

  async login(data) {
    // data: { email, password }
    const res = await api.post("/auth/login", data);
    return res.data; // { success, accessToken, user }
  },

  async getProfile() {
    const res = await api.get("/auth/profile");
    return res.data; // { success, user }
  },

  async updateProfile(data) {
    // data: { name, avatar }
    const res = await api.put("/auth/profile", data);
    return res.data; // { success, user }
  },
};

export default authService;
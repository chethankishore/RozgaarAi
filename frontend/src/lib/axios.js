import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// on 401 — clear token and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthRoute = err.config?.url?.includes("/auth/");
    if (err.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;


// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true, // IMPORTANT
// });

// // Handle auth errors
// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     const isAuthRoute = err.config?.url?.includes("/auth/");

//     if (err.response?.status === 401 && !isAuthRoute) {
//       window.location.href = "/login";
//     }

//     return Promise.reject(err);
//   }
// );

// export default api;
// export const BASE_URL ="http://localhost:7777";
// export const BASE_URL ="https://devtinder-yfhj.onrender.com";



const deployedApi = (
  import.meta.env.VITE_API_BASE_URL || "https://devtinder-yfhj.onrender.com"
).trim();

export const BASE_URL =
  window.location.hostname === "localhost" ? "http://localhost:7777" : deployedApi;

export const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "906413381089-qm4m82gvie7gdu7r1qdr1faq8i5upqbu.apps.googleusercontent.com";
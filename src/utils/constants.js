// export const BASE_URL ="http://localhost:7777";
// export const BASE_URL ="https://devtinder-yfhj.onrender.com";



const deployedApi = (
  import.meta.env.VITE_API_BASE_URL || "https://devtinder-yfhj.onrender.com"
).trim();

export const BASE_URL =
  window.location.hostname === "localhost" ? "http://localhost:7777" : deployedApi;
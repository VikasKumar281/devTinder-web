// export const BASE_URL ="http://localhost:7777";
// export const BASE_URL ="https://devtinder-yfhj.onrender.com";



export const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "https://devtinder-yfhj.onrender.com"
).trim();
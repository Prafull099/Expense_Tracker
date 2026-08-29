// Centralized API configuration reading from Vite environment variables
// Set VITE_API_BASE_URL in your hosting platform (e.g. Render) to point to your live backend.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Prefer env var if provided; otherwise default to deployed Render backend
export const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL ||
	"https://agrovision-ai-z1za.onrender.com";

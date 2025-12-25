export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#166534", // green-800
        secondary: "#22c55e", // green-500
        accent: "#eab308", // yellow-500
        dark: "#0f172a", // slate-900
        light: "#f8fafc", // slate-50
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3E4B51",
        secondary: "#D4A373",
        accent: "#E8E6E1",
        background: "#FFFFFF",
        surface: "#F8F9FA",
        text: {
          heading: "#2C3338",
          body: "#5A6469",
          muted: "#9CA3AF"
        },
        border: "#E5E7EB"
      },
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        body: ["Figtree", "sans-serif"]
      },
      borderRadius: {
        card: "12px",
        button: "8px",
        input: "6px"
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(62, 75, 81, 0.1), 0 2px 4px -1px rgba(62, 75, 81, 0.06)",
        floating: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }
    },
  },
  plugins: [],
}

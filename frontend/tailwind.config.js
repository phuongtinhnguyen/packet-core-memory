/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#fff8f2",
        rose: "#ff6f91",
        gold: "#f6c177",
        mint: "#8be7d0",
      },
    },
  },
  plugins: [],
};

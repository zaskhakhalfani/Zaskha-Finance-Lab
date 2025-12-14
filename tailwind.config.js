/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // <-- use the .dark class instead of system theme
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

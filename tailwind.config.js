/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        display: ["var(--font-lexend)"],
        mono: ["var(--font-jetbrains-mono)"],
      },
    },
  },

  plugins: [],
}

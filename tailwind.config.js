/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-blue": "#0A81D1",
        "secondary-blue": "#314cb6",
        "primary-violet": "#6461a0",
        "secondary-violet": "#B68CB8",
        "primary-pink": "#ef69eb",
      }
    },
  },
  plugins: [],
}
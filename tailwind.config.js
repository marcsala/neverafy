/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#16a34a',
        'primary-blue': '#2563eb',
      }
    },
  },
  plugins: [],
}

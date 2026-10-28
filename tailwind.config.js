/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nxt: {
          blue: '#1a56db',
          dark: '#0f172a',
          teal: '#0e7490',
          amber: '#f59e0b',
          emerald: '#10b981',
        }
      }
    },
  },
  plugins: [],
}


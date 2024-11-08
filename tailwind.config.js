/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'leu-green': '#849569',
        'leu-cream': '#eee8dc',
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: { inter: ['Inter','ui-sans-serif','system-ui'] },
      colors: {
        brand: '#2563eb',
        bg: '#0b1020',
        card: '#0f172a',
        border: '#1e293b',
      },
    },
  },
  plugins: [],
};

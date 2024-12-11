/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'bg-green-100',
    'bg-green-900',
    'text-green-800',
    'text-green-200',
    'bg-yellow-100',
    'bg-yellow-900',
    'text-yellow-800',
    'text-yellow-200',
    'bg-blue-100',
    'bg-blue-900',
    'text-blue-800',
    'text-blue-200',
    'bg-gray-100',
    'bg-gray-700',
    'text-gray-800',
    'text-gray-200'
  ]
}

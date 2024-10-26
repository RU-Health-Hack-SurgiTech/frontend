/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
  './node_modules/@shadcn/ui/dist/**/*.{js,ts,jsx,tsx}'
],
theme: {
  extend: {
    fontFamily: {
      khand: ['Khand', 'sans-serif'],
      puritan: ['Puritan', 'sans-serif'],
      telex: ['Telex', 'sans-serif']
    },
    borderRadius: {
      lg: 'var(--radius)',
      md: 'calc(var(--radius) - 2px)',
      sm: 'calc(var(--radius) - 4px)'
    },
    colors: {}
  }
},
plugins: [
  // require('@tailwindcss/forms'),
  //   require("tailwindcss-animate")
],
}
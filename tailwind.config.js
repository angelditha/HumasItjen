/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kemendagri: {
          navy: '#063a69',
          'navy-dark': '#042646',
          'navy-light': '#0a4f8f',
          gold: '#fbae17',
          'gold-light': '#fec34d',
          'gold-dark': '#d48f05',
          sand: '#f4f2ee',
          surface: '#f8fafc',
          card: '#ffffff'
        }
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['"Open Sans"', 'sans-serif']
      }
    },
  },
  plugins: [],
}

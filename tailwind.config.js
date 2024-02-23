/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [],
  theme: {
    extend: {
      boxShadow: {
        'outer-white': '0 0 10px rgba(255, 255, 255, 0.2)',
        'outer-black': '0 0 10px rgba(0, 0, 0, 0.1)'
      },

      screens: {
        'wsm': {'min': '640px', 'max': '767px'},
        'wmd': {'min': '768px', 'max': '1023px'},
        'wlg': {'min': '1024px', 'max': '1279px'},
        'wxl': {'min': '1280px', 'max': '1488px'},
        'w2xl': {'min': '1488px'},
      },
    },
  },
  plugins: [
    // require('@tailwindcss/forms'),
  ],
}

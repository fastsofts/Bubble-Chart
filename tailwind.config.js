/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')
module.exports = {
  content: [
       "./pages/**/*.{js,jsx,ts,tsx}",
       "./pages/components/**/*.{js,jsx,ts,tsx}",
  ],
  plugins:[
    plugin(function ({ addBase, addComponents, addUtilities, theme }) {
      addComponents({
        '.hideOptions': {
          opacity:0,
        },
        '.showOptions': {
          opacity:1,
        }
      })
    }),
  ],
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 3s ease-in-out"
      },
      keyframes: () => ({
          fadeIn: {
            "0%": { opacity: 0,transform: "translate3d(0, 5%, 0)" },
            "100%": { opacity: 1, transform: "translate3d(0, 0, 0)"}
          }
      })
    }  
  }
}


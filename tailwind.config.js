/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      customInput: {
        border: '2px solid #3498db',
        padding: '0.5rem',
        borderRadius: '0.25rem',
        '&:focus': {
          outline: 'none',
          borderColor: '#2980b9',
        },
      },
    },
  },
  plugins: [],
}


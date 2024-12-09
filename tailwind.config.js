const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.white,
        secondary: colors.black,
        'secondary-2': colors.slate[400],
        'secondary-3': colors.gray[100],
        tertiary: colors.gray[300],
        disabled: colors.neutral[300],
        hover: colors.gray[100],
        'hover-1': colors.neutral[600],
        error: colors.red[500],
        'disabled-background': '#f8f8f8',
        'disabled-border': '#dcdcdc',
      },
      textColor: {
        primary: colors.black,
        secondary: colors.white,
        tertiary: colors.neutral[400],
        hyperlink: colors.indigo[500],
        error: colors.red[500],
      },
      screens: {
        hoverable: { raw: '(pointer:fine)' },
        touchable: { raw: '(pointer:coarse)' },
        mobile: { max: '767px' },
        print: { raw: 'print' },
      },
      fontSize: {
        h1: ['1.875rem', '2.25rem'],
        h2: ['1.25rem', '1.75rem'],
        h3: ['1.125rem', '1.75rem'],
        h4: ['1rem', '1.5rem'],
        h5: ['0.875rem', '1.25rem'],
        h6: ['0.75rem', '1rem'],
      },
    },
  },
  plugins: [],
};

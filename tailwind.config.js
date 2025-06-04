// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // Important for the dark mode toggle
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            // Add any global prose overrides here
            // Example: Ensure links within prose are styled correctly
            a: {
              // color: theme('colors.blue.600'), // Managed by Link extension class now
              // '&:hover': {
              //   color: theme('colors.blue.800'),
              // },
            },
            // Ensure code blocks and inline code have a background and padding
            code: {
              // backgroundColor: theme('colors.gray.100'),
              // padding: '0.2em 0.4em',
              // borderRadius: theme('borderRadius.md'),
              // fontWeight: '400',
            },
            "code::before": {
              // Hide default ::before and ::after content for inline code
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            // Style pre (code blocks)
            pre: {
              // backgroundColor: theme('colors.gray.800'), // Handled by CodeBlockLowlight classes
              // color: theme('colors.gray.100'),
              // padding: theme('spacing.4'),
              // borderRadius: theme('borderRadius.md'),
              // overflowX: 'auto',
            },
            "pre code": {
              // Reset styles for code inside pre as it's handled by highlight.js
              // backgroundColor: 'transparent',
              // padding: '0',
              // color: 'inherit',
              // borderRadius: '0',
            },
            // Images in prose
            img: {
              // marginLeft: 'auto', // if you want to center block images
              // marginRight: 'auto',
              // borderRadius: theme('borderRadius.lg'),
            },
          },
        },
        dark: {
          // For `dark:prose-invert`
          css: {
            // a: {
            //   color: theme('colors.blue.400'),
            //   '&:hover': {
            //     color: theme('colors.blue.300'),
            //   },
            // },
            // code: {
            //   backgroundColor: theme('colors.gray.700'),
            //   color: theme('colors.gray.200'),
            // },
            // pre: {
            //   backgroundColor: theme('colors.gray.900'),
            //   color: theme('colors.gray.200'),
            // },
          },
        },
      }),
    },
  },
  plugins: [
    require("@tailwindcss/typography"), // For the `prose` classes
  ],
};

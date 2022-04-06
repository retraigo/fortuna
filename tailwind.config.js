export default {
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      typography(theme) {
        return {
          dark: {
            css: {
              color: theme("colors.gray.300"),
              '[class~="lead"]': { color: theme("colors.gray.400") },
              a: { color: theme("colors.gray.100") },
              strong: { color: theme("colors.gray.100") },
              "ul > li::before": { backgroundColor: theme("colors.gray.700") },
              hr: { borderColor: theme("colors.gray.800") },
              blockquote: {
                color: theme("colors.gray.100"),
                borderLeftColor: theme("colors.gray.800"),
              },
              h1: { color: theme("colors.gray.100") },
              h2: { color: theme("colors.gray.100") },
              h3: { color: theme("colors.gray.100") },
              h4: { color: theme("colors.gray.100") },
              code: { color: theme("colors.gray.100"), backgroundColor: theme("colors.gray.800") },
              "a code": { color: theme("colors.gray.200") },
              pre: {
                color: theme("colors.gray.200"),
                backgroundColor: theme("colors.gray.800"),
              },
              thead: {
                color: theme("colors.gray.100"),
                borderBottomColor: theme("colors.gray.700"),
              },
              "tbody tr": { borderBottomColor: theme("colors.gray.800") },
            },
          },
          css: {
            maxWidth: "60rem",
          },
        };
      },
      maxWidth: {
        "8xl": "90rem",
        "9xl": "100rem",
        "10xl": "110rem",
      },
      fontFamily: {
        open: ["Open Sans", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        maid: {
          100: "#ffe6f9",
          200: "#ffb3ed",
          300: "#ff80e1",
          400: "#ff4dd5",
          500: "#ff1ac9",
          600: "#cc009c",
          border: "#4ef0fc",
          bg: "#030005",
        },
        gray: {
          100: "#ffe6f9",
          200: "#ffb3ed",
          300: "#ff99e7",
          400: "#ff80e1",
          500: "#800062",
          600: "#66004e",
          700: "#4d003b",
          800: "#330027",
          900: "#1a0014",
        },
        nett: {
          kuro: "#944dff",
          maid: "#ff00c3",
        },
      },
      translate: {
        110: "30rem",
        120: "40rem",
        "-110": "-30rem",
        "-120": "-40rem",
      },
      margin: {
        110: "30rem",
        120: "40rem",
        130: "50rem",
        140: "60rem",
        "-110": "-30rem",
        "-120": "-40rem",
      },
    },
    zIndex: {
      0: 0,
      10: 10,
      20: 20,
      25: 25,
      30: 30,
      40: 40,
      45: 45,
      50: 50,
      75: 75,
      100: 100,
      auto: "auto",
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

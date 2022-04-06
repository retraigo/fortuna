import theme from "@nuxt/content-theme-docs";

export default theme({
  // loading: `${__dirname}/components/Global/Effects/PingEye.vue`,
  head: {
    link: [
      { rel: "stylesheet", href: "/transition.css" },
    ],
  },
  docs: {
    primaryColor: "#ff00c3",
  },
});

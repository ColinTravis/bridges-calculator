import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  vite: { plugins: [tailwindcss()] },
  modules: ["@nuxt/fonts", "@nuxt/icon"],
  css: ["~/assets/css/main.css"],
});

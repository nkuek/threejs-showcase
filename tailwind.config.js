/** @type {import('tailwindcss').Config} */
import fluid, { extract, screens, fontSize } from "fluid-tailwind";
import tailwindMotion from "tailwindcss-motion";

export default {
  content: {
    files: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
    extract,
  },
  theme: {
    screens,
    fontSize,
    extend: {},
  },
  plugins: [fluid, tailwindMotion],
};

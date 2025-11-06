/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  // Con @tailwindcss/vite no es necesario especificar content en v4
  plugins: [daisyui],
  daisyui: {
    // Solo dos temas: el corporativo "dayiva" y "black"
    themes: [
      {
        dayiva: {
          primary: "#1e40af",
          secondary: "#22c55e",
          accent: "#f59e0b",
          neutral: "#1f2937",
          "base-100": "#ffffff",
          info: "#38bdf8",
          success: "#16a34a",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
      "black",
    ],
  },
};

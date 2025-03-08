import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    container: {
      padding : '1rem',
    },
    extend: {
      fontFamily: {
        sans: ["Roboto", "sans-serif"], // 
        // 다른 사용자 정의 폰트도 여기에 추가 가능
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    require("daisyui")
  ],
} satisfies Config;

import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      padding : '1rem',
    },
    extend: {
      fontFamily: {
        rubik: ["Rubik", "sans-serif"], // 'Rubik' 폰트 추가
        // 다른 사용자 정의 폰트도 여기에 추가 가능
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;

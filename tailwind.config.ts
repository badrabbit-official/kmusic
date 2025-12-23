import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        yandex: {
          yellow: '#fc0',
          dark: '#1a1a1a',
        },
        cyber: {
          cyan: '#00ffff',
          magenta: '#ff00ff',
          blue: '#0066ff',
          purple: '#9933ff',
          pink: '#ff00cc',
        },
      },
      animation: {
        'glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 20s infinite',
        'glitch': 'glitch 2s infinite',
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #00ffff 0%, #ff00ff 100%)',
        'cyber-mesh': 'radial-gradient(circle at 20% 50%, rgba(0,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,0,255,0.1) 0%, transparent 50%)',
      },
      boxShadow: {
        'cyber': '0 0 20px rgba(0,255,255,0.5), 0 0 40px rgba(0,255,255,0.3)',
        'cyber-lg': '0 0 30px rgba(0,255,255,0.6), 0 0 60px rgba(0,255,255,0.4)',
      },
    },
  },
  plugins: [],
} satisfies Config;

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accessible: {
          green: '#16a34a',
          amber: '#d97706',
          red: '#dc2626',
        },
      },
    },
  },
  plugins: [],
};

export default config;

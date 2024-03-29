import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      sm: "480px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "992px",
      // => @media (min-width: 992px) { ... }

      xl: "1200px",
      // => @media (min-width: 1200px) { ... }

      xxl: "1700px",
      // => @media (min-width: 1440px) { ... }
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        blackops: ['var(--font-blackops)'],
        SourceSans3: ['var(--font-source-sans-3)'],
      },
      colors: {
        brandColor: '#EAB308', // blue
        lightPink: '#3B82F6', // pinkish 
        dark: '#', //black
        dark2: '#8A8A8E', //gray
        light: '#F2F2F7', //ash white 
        light2: '#FFFFFF', //Milky White
      }
    },
  },
  plugins: [],
}
export default config

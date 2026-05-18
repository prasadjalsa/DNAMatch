import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        risk: {
          none: '#22c55e',
          low: '#84cc16',
          moderate: '#f59e0b',
          high: '#ef4444',
          very_high: '#7f1d1d',
        },
      },
    },
  },
  plugins: [],
}

export default config

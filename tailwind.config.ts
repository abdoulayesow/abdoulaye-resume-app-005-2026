import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx,yml}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        muted: 'var(--color-muted)',
        line: 'var(--color-line)',
        'bg-dark': 'var(--color-bg-dark)',
        'bg-dark-elev': 'var(--color-bg-dark-elev)',
        'edge-idle': 'var(--color-edge-idle)',
        'edge-signal': 'var(--color-edge-signal)',
        glow: 'var(--color-glow)',
        'text-dark': 'var(--color-text-dark)',
        'text-dark-muted': 'var(--color-text-dark-muted)',
      },
      fontSize: {
        'resume-xs': ['0.6rem', { lineHeight: '0.85rem' }],
        'resume-sm': ['0.675rem', { lineHeight: '0.925rem' }],
        'resume-base': ['0.725rem', { lineHeight: '1rem' }],
        'resume-lg': ['0.8rem', { lineHeight: '1.1rem' }],
        'resume-xl': ['0.925rem', { lineHeight: '1.25rem' }],
        'resume-2xl': ['1.1rem', { lineHeight: '1.4rem' }],
        'resume-3xl': ['1.5rem', { lineHeight: '1.85rem' }],
        'resume-4xl': ['2rem', { lineHeight: '2.25rem' }],
      },
    },
  },
  plugins: [],
}
export default config

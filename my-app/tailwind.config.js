export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: '#1A2332',
          'ink-soft': '#273247',
          royal: '#243F8F',
          'royal-soft': '#E8EFFF',
        },
        page: '#F3F5F8',
        line: '#DFE4EB',
        copy: '#334155',
        muted: '#64748B',
        alert: {
          coral: '#D84F45',
          soft: '#FFF0EF',
        },
        success: {
          DEFAULT: '#26A269',
          soft: '#EAF8F0',
        },
        warning: {
          DEFAULT: '#D6A12D',
          soft: '#FFF7DF',
        },
      },
      boxShadow: {
        panel: '0 14px 28px rgba(15, 23, 42, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
    },
  },
}

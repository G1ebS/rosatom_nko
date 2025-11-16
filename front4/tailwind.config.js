module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a2165',    // корпоративный синий Росатом (из логотипа)
          50: '#e6e8f0',
          100: '#ccd1e1',
          200: '#99a3c3',
          300: '#6675a5',
          400: '#334787',
          500: '#1a2165',
          600: '#141a51',
          700: '#0f143d',
          800: '#0a0d29',
          900: '#050715',
        },
        primaryLight: '#4896d2', // светлый синий из градиента логотипа
        accent: {
          DEFAULT: '#00A651',   // корпоративный зеленый Росатом
          hover: '#008a43',
          50: '#e6f5ec',
          100: '#ccebd9',
          200: '#99d7b3',
          300: '#66c38d',
          400: '#33af67',
          500: '#00A651',
          600: '#008541',
        },
        muted: '#6B7280',
        danger: {
          DEFAULT: '#EF4444',
          hover: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Rosatom', 'Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
        rosatom: ['Rosatom', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 61, 130, 0.08)',
        'card-strong': '0 4px 16px rgba(0, 61, 130, 0.12)',
        'modern': '0 4px 20px rgba(0, 61, 130, 0.1)',
        'modern-hover': '0 8px 32px rgba(0, 61, 130, 0.15)',
        'floating': '0 12px 40px rgba(0, 61, 130, 0.12)',
      },
      borderRadius: {
        'modern': '8px',
        'modern-lg': '12px',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        'fade-in-up': {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'fade-in-up': 'fade-in-up .6s ease both'
      }
    },
  },
  plugins: [],
}

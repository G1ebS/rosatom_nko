module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#004AAD',    // глубокий насыщенный синий
          50: '#e6f0ff',
          100: '#cce0ff',
          200: '#99c1ff',
          300: '#66a2ff',
          400: '#3383ff',
          500: '#004AAD',
          600: '#003b8a',
          700: '#002c67',
          800: '#001d45',
          900: '#000e22',
        },
        accent: {
          DEFAULT: '#00D4AA',   // бирюзовый акцент
          hover: '#00b894',
          50: '#e6faf5',
          100: '#ccf5eb',
          200: '#99ebd7',
          300: '#66e1c3',
          400: '#33d7af',
          500: '#00D4AA',
          600: '#00aa88',
        },
        muted: '#6B7280',
        danger: {
          DEFAULT: '#EF4444',
          hover: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
      },
      boxShadow: {
        'card': '0 6px 18px rgba(15, 23, 42, 0.06)',
        'card-strong': '0 10px 30px rgba(15, 23, 42, 0.12)',
        'modern': '0 8px 32px rgba(0, 74, 173, 0.12)',
        'modern-hover': '0 16px 48px rgba(0, 74, 173, 0.18)',
        'floating': '0 20px 60px rgba(0, 74, 173, 0.15)',
      },
      borderRadius: {
        'modern': '16px',
        'modern-lg': '20px',
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

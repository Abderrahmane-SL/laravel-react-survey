// Design tokens to use throughout the application
export const theme = {
  colors: {
    primary: {
      DEFAULT: "hsl(222.2 47.4% 11.2%)",
      foreground: "hsl(210 40% 98%)",
      50: "hsl(210 40% 98%)",
      100: "hsl(214.3 31.8% 91.4%)",
      200: "hsl(213.3 31.8% 83.2%)",
      300: "hsl(214.3 31.8% 76.1%)",
      400: "hsl(218.2 39.3% 57.1%)",
      500: "hsl(218.1 41.2% 45.1%)",
      600: "hsl(220.9 44.1% 41.0%)",
      700: "hsl(224.4 47.4% 37.6%)",
      800: "hsl(226.4 50.0% 33.7%)",
      900: "hsl(226.4 55.0% 26.5%)",
    },
    destructive: {
      DEFAULT: "hsl(0 84.2% 60.2%)",
      foreground: "hsl(210 40% 98%)",
    },
    success: {
      DEFAULT: "hsl(142.1 76.2% 36.3%)",
      foreground: "hsl(355.7 100% 97.3%)",
    },
    muted: {
      DEFAULT: "hsl(210 40% 96.1%)",
      foreground: "hsl(215.4 16.3% 46.9%)",
    },
    accent: {
      DEFAULT: "hsl(210 40% 96.1%)",
      foreground: "hsl(222.2 47.4% 11.2%)",
    },
    card: {
      DEFAULT: "hsl(0 0% 100%)",
      foreground: "hsl(222.2 47.4% 11.2%)",
    },
  },
  fonts: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },
  radii: {
    sm: "0.125rem",
    DEFAULT: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px",
  },
  transitions: {
    DEFAULT: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
    fast: "100ms cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "300ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
}
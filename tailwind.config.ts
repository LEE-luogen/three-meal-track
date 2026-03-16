import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "390px",
        md: "430px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['"SF Pro Display"', '"PingFang SC"', "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // 餐次专属色
        breakfast: {
          DEFAULT: "hsl(var(--breakfast))",
          light: "hsl(var(--breakfast-light))",
          foreground: "hsl(var(--breakfast-foreground))",
        },
        lunch: {
          DEFAULT: "hsl(var(--lunch))",
          light: "hsl(var(--lunch-light))",
          foreground: "hsl(var(--lunch-foreground))",
        },
        dinner: {
          DEFAULT: "hsl(var(--dinner))",
          light: "hsl(var(--dinner-light))",
          foreground: "hsl(var(--dinner-foreground))",
        },
        // 状态色
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        pending: "hsl(var(--pending))",
        // Pro / Premium 专属色
        pro: {
          gold: "hsl(var(--pro-gold))",
          "gradient-start": "hsl(var(--pro-gradient-start))",
          "gradient-end": "hsl(var(--pro-gradient-end))",
        },
        // 生理阶段色
        phase: {
          1: "hsl(var(--phase-1))",
          2: "hsl(var(--phase-2))",
          3: "hsl(var(--phase-3))",
          4: "hsl(var(--phase-4))",
          5: "hsl(var(--phase-5))",
        },
        // 断食 / 进食动态色
        fasting: {
          start: "hsl(var(--fasting-start))",
          end: "hsl(var(--fasting-end))",
        },
        eating: {
          start: "hsl(var(--eating-start))",
          end: "hsl(var(--eating-end))",
        },
        // AI 色
        ai: {
          start: "hsl(var(--ai-gradient-start))",
          end: "hsl(var(--ai-gradient-end))",
        },
        // Onboarding 专用色
        onboarding: {
          background: "hsl(var(--onboarding-background))",
          card: "hsl(var(--onboarding-card))",
          primary: "hsl(var(--onboarding-primary))",
          accent: "hsl(var(--onboarding-accent))",
          cta: "hsl(var(--onboarding-cta))",
          divider: "hsl(var(--onboarding-divider))",
          text: "hsl(var(--onboarding-text))",
          secondary: "hsl(var(--onboarding-secondary))",
        },
      },
      borderRadius: {
        "3xl": "1.5rem",
        "2xl": "1.25rem",
        xl: "1rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
        meal: "0 4px 20px -4px hsl(var(--primary) / 0.15)",
        "glow-primary": "var(--shadow-glow-primary)",
        "glow-accent": "var(--shadow-glow-accent)",
        "glow-breakfast": "0 4px 20px -4px hsl(var(--breakfast) / 0.3)",
        "glow-lunch": "0 4px 20px -4px hsl(var(--lunch) / 0.3)",
        "glow-dinner": "0 4px 20px -4px hsl(var(--dinner) / 0.3)",
      },
      spacing: {
        page: "var(--spacing-page)",
        section: "var(--spacing-section)",
        "card-inner": "var(--spacing-card)",
        element: "var(--spacing-element)",
        dense: "var(--spacing-dense)",
        tight: "var(--spacing-tight)",
        micro: "var(--spacing-micro)",
      },
      transitionTimingFunction: {
        organic: "var(--ease-organic)",
        "ease-out-custom": "var(--ease-out)",
      },
      transitionDuration: {
        fast: "var(--duration-fast)",
        normal: "var(--duration-normal)",
        slow: "var(--duration-slow)",
        slower: "var(--duration-slower)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          from: { opacity: "1", transform: "translateY(0)" },
          to: { opacity: "0", transform: "translateY(10px)" },
        },
        breathing: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        "card-appear": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        celebrate: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "50%": { transform: "scale(1.2)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "star-fall": {
          "0%": { opacity: "0", transform: "translateY(-20px) rotate(0deg)" },
          "20%": { opacity: "1" },
          "100%": {
            opacity: "0",
            transform: "translateY(80px) rotate(360deg)",
          },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-out-right": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "slide-up": "slide-up 0.4s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-in-up": "fade-in-up 0.4s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        breathing: "breathing 2.5s ease-in-out infinite",
        "card-appear": "card-appear 0.3s ease-out",
        celebrate: "celebrate 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "star-fall": "star-fall 1.5s ease-out forwards",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-out-right": "slide-out-right 0.3s ease-out",
        enter: "fade-in 0.3s ease-out, scale-in 0.2s ease-out",
        exit: "fade-out 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

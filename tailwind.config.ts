import type { Config } from "tailwindcss";

const hsl = (v: string) => `hsl(var(--${v}) / <alpha-value>)`;

const config = {
  darkMode: ["class"],
  content: ["./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", md: "2rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "ui-sans-serif", "sans-serif"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
      },
      colors: {
        border: hsl("border"),
        input: hsl("input"),
        ring: hsl("ring"),
        background: hsl("background"),
        foreground: hsl("foreground"),
        primary: { DEFAULT: hsl("primary"), foreground: hsl("primary-foreground") },
        secondary: { DEFAULT: hsl("secondary"), foreground: hsl("secondary-foreground") },
        destructive: { DEFAULT: hsl("destructive"), foreground: hsl("destructive-foreground") },
        muted: { DEFAULT: hsl("muted"), foreground: hsl("muted-foreground") },
        accent: { DEFAULT: hsl("accent"), foreground: hsl("accent-foreground") },
        popover: { DEFAULT: hsl("popover"), foreground: hsl("popover-foreground") },
        card: { DEFAULT: hsl("card"), foreground: hsl("card-foreground") },
        // Brand pair: teal = what you teach, violet = what you want to learn.
        teach: { DEFAULT: hsl("teach"), soft: hsl("teach-soft"), ink: hsl("teach-ink") },
        learn: { DEFAULT: hsl("learn"), soft: hsl("learn-soft"), ink: hsl("learn-ink") },
        success: { DEFAULT: hsl("success"), soft: hsl("success-soft") },
        warning: { DEFAULT: hsl("warning"), soft: hsl("warning-soft") },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        soft: "0 1px 2px hsl(240 10% 10% / 0.04), 0 4px 16px -4px hsl(240 10% 10% / 0.06)",
        lift: "0 2px 4px hsl(240 10% 10% / 0.04), 0 16px 40px -12px hsl(240 10% 10% / 0.16)",
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        "float-y": { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        "swap-spin": { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(180deg)" } },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "float-y": "float-y 6s ease-in-out infinite",
        "swap-spin": "swap-spin 0.5s cubic-bezier(0.65, 0, 0.35, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;

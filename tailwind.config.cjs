/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // ============================================
      // Brand Colors
      // ============================================
      colors: {
        // Primary Colors
        primary: {
          blue: "#007BFF",
          green: "#28A745",
        },
        // Secondary Colors
        secondary: {
          light: "#F1F1F1",
          dark: "#333333",
        },
        // Neutral Palette
        neutral: {
          black: "#000000",
          white: "#FFFFFF",
          100: "#F8F9FA",
          200: "#E9ECEF",
          300: "#DEE2E6",
          400: "#CED4DA",
          500: "#ADB5BD",
          600: "#6C757D",
          700: "#495057",
          800: "#343A40",
          900: "#212529",
        },
        // Semantic Colors
        danger: "#DC3545",
        // Alias for easier usage
        visibuy: {
          blue: "#007BFF",
          green: "#28A745",
        },
      },

      // ============================================
      // Typography
      // ============================================
      fontFamily: {
        primary: ["Montserrat", "sans-serif"],
        secondary: ["Open Sans", "sans-serif"],
        sans: ["Open Sans", "sans-serif"], // Default sans-serif
      },
      fontSize: {
        // Headings - Desktop
        "h1-desktop": ["56px", { lineHeight: "1.2", fontWeight: "700" }],
        "h2-desktop": ["32px", { lineHeight: "1.3", fontWeight: "600" }],
        "h3-desktop": ["28px", { lineHeight: "1.3", fontWeight: "600" }],
        "h4-desktop": ["24px", { lineHeight: "1.4", fontWeight: "500" }],
        "h5-desktop": ["20px", { lineHeight: "1.4", fontWeight: "500" }],
        "h6-desktop": ["18px", { lineHeight: "1.4", fontWeight: "500" }],
        // Headings - Mobile
        "h1-mobile": ["32px", { lineHeight: "1.2", fontWeight: "700" }],
        "h2-mobile": ["28px", { lineHeight: "1.3", fontWeight: "600" }],
        "h3-mobile": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        // Body Text
        "body-large": ["18px", { lineHeight: "1.5", fontWeight: "400" }],
        "body-medium": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "body-small": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "1.5", fontWeight: "400" }],
      },
      fontWeight: {
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },

      // ============================================
      // Spacing System (4-point grid)
      // ============================================
      spacing: {
        "space-4": "4px",
        "space-8": "8px",
        "space-12": "12px",
        "space-16": "16px",
        "space-20": "20px",
        "space-24": "24px",
        "space-32": "32px",
        "space-40": "40px",
        "space-48": "48px",
      },

      // ============================================
      // Border Radius
      // ============================================
      borderRadius: {
        card: "12px",
        input: "8px",
        "btn-large": "12px",
        "btn-medium": "10px",
        "btn-small": "8px",
      },

      // ============================================
      // Shadows & Elevation
      // ============================================
      boxShadow: {
        "elevation-1": "0px 2px 8px rgba(0, 0, 0, 0.06)",
        "elevation-2": "0px 4px 12px rgba(0, 0, 0, 0.08)",
        "elevation-3": "0px 6px 20px rgba(0, 0, 0, 0.12)",
        card: "0px 2px 8px rgba(0, 0, 0, 0.06)", // Alias for card shadow
      },

      // ============================================
      // Breakpoints
      // ============================================
      screens: {
        mobile: "360px",
        "mobile-max": { max: "479px" },
        tablet: "600px",
        "tablet-max": { max: "833px" },
        desktop: "1280px",
        // Container breakpoints
        "container-mobile": "360px",
        "container-tablet": "600px",
        "container-desktop": "1080px",
      },

      // ============================================
      // Container Configuration
      // ============================================
      container: {
        center: true,
        padding: {
          DEFAULT: "16px",
          mobile: "16px",
          tablet: "24px",
          desktop: "32px",
        },
        screens: {
          mobile: "100%",
          tablet: "600px",
          desktop: "1080px",
        },
      },

      // ============================================
      // Component Utilities
      // ============================================
      height: {
        "btn-large": "56px",
        "btn-medium": "48px",
        "btn-small": "40px",
        input: "48px",
      },
      minHeight: {
        "tap-target": "48px", // Accessibility minimum tap target
      },
      padding: {
        "btn-large-x": "24px",
        "btn-medium-x": "20px",
        "btn-small-x": "16px",
        "card-sm": "16px",
        "card-md": "24px",
      },
      gap: {
        "form-field": "16px", // Spacing between form fields
        "label-input": "8px", // Space between label and input
      },

      // ============================================
      // Transitions
      // ============================================
      transitionDuration: {
        subtle: "150ms",
        standard: "200ms",
        smooth: "250ms",
      },
      transitionTimingFunction: {
        "ease-subtle": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

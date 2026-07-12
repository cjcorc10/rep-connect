import { Montserrat, Merriweather_Sans } from "next/font/google";

export const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const merriweatherSans = Merriweather_Sans({
  subsets: ["latin"],
  variable: "--font-merriweather-sans",
  display: "swap",
});

/** Combined class names for applying next/font CSS variables on `<html>`. */
export const fontVariables = `${montserrat.variable} ${merriweatherSans.variable}`;

/** Resolved font-family strings for inline / JS styling. */
export const fontFamilies = {
  heading: montserrat.style.fontFamily,
  body: merriweatherSans.style.fontFamily,
} as const;

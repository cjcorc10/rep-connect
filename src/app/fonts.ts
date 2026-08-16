import { Archivo, Public_Sans } from "next/font/google";

export const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});

/** Combined class names for applying next/font CSS variables on `<html>`. */
export const fontVariables = `${archivo.variable} ${publicSans.variable}`;

/** Resolved font-family strings for inline / JS styling. */
export const fontFamilies = {
  heading: archivo.style.fontFamily,
  body: publicSans.style.fontFamily,
} as const;

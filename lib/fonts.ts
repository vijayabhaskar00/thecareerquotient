import { Instrument_Sans, Archivo } from "next/font/google";

export const fontSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Archivo has a width axis; headings use its condensed, heavy cut.
export const fontDisplay = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-display",
  display: "swap",
});

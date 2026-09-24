import type { Metadata } from "next";
import { fontSans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "TheCareerQuotient",
  description: "Marketing site for TheCareerQuotient",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontSans.variable}>
      <body>{children}</body>
    </html>
  );
}

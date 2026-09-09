import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ask Cadre | Cadre AI",
  description:
    "Find answers about Cadre AI services, industries, strategist conversations, and the AI Maturity Index.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

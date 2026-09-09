import type { Metadata } from "next";
import type { ReactNode } from "react";
import { activeProduct } from "@/product/active";
import "./globals.css";
import "./premium.css";

export function generateMetadata(): Metadata {
  const product = activeProduct();
  return {
    title: `${product.experience.assistantLabel} | ${product.client.clientName}`,
    description: product.experience.copy.heroDescription,
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

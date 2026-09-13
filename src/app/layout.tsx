import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "wAIter - Intelligent Assistant",
  description: "AI-powered web assistant, designed with Clarity, Deference, and Depth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased h-full">
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}

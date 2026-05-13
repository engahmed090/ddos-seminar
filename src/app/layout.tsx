import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DoS & DDoS Attacks — Cybersecurity Seminar",
  description:
    "An interactive, production-ready seminar presentation on Denial of Service and Distributed Denial of Service attacks. Includes live simulation, traffic detection, and real dataset visualizations.",
  keywords: ["DoS", "DDoS", "cybersecurity", "network attacks", "CICIDS2017", "SYN flood"],
  authors: [{ name: "Ahmad Osman", url: "mailto:ahmadosman7212@gmail.com" }],
  openGraph: {
    title: "DoS & DDoS Attacks — Cybersecurity Seminar",
    description: "Interactive cybersecurity seminar covering DoS/DDoS attack types, live simulation, and ML-based detection datasets.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <meta name="theme-color" content="#020817" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

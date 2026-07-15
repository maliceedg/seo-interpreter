import type { Metadata } from "next";
import { Courier_Prime, Public_Sans } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const courierPrime = Courier_Prime({
  variable: "--font-courier-prime",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Lighthouse Insights",
  description: "Turn Lighthouse JSON into client-ready Top 10 + Diagnostics exports.",
};

const materialSymbolsHref =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${courierPrime.variable} h-full antialiased`}
    >
      <head>
        <link rel="stylesheet" href={materialSymbolsHref} />
      </head>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}

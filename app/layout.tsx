import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { PlayerProvider } from "./contexts/PlayerContext";
import { ToastContainer } from "./components/Toast";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  title: "KMusic | Cyberpunk Music Streaming",
  description: "Профессиональный стриминговый сервис для музыки в стиле киберпанк",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body className={`${inter.variable} ${orbitron.variable} antialiased`}>
        <PlayerProvider>
          {children}
          <ToastContainer />
        </PlayerProvider>
      </body>
    </html>
  );
}

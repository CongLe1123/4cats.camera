import "./globals.css";
import { Navbar } from "../components/Navbar";

export const metadata = {
  title: "4cats.camera | Rent & Find Your Perfect Camera",
  description:
    "Beginner-friendly camera rental and buying assistance for creators and travelers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col overflow-x-hidden">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <footer className="border-t py-12 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground text-sm font-medium">
              © 2026 4cats.camera - Your cozy camera companion 🐱📸
            </p>
            <p className="text-muted-foreground/60 text-xs mt-1">
              Made with love for beginners and creators.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

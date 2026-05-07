import { type ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useLocation } from "wouter";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const isWatchPage = location.startsWith("/watch/");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className={isWatchPage ? "pt-16" : "pt-16"}>
        {children}
      </main>
      {!isWatchPage && <Footer />}
    </div>
  );
}

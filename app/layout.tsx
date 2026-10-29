import type { Metadata } from "next";
import "./globals.css";
import Splash from "@/components/Splash";
import Header from "@/components/Header";
import ManagerWidget from "@/components/ManagerWidget";
import Footer from "@/components/Footer";
const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const metadata: Metadata = {
  metadataBase: new URL(site), title: "ИНТЕРЬЕР — магазин освещения",
  description: "Современное освещение для красивых и уютных интерьеров.", alternates: { canonical: "/" },
  openGraph: { title: "ИНТЕРЬЕР", description: "Свет, который создаёт атмосферу", type: "website", locale: "ru_RU" },
  icons: { icon: "/logo.png" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="ru" suppressHydrationWarning><body><script dangerouslySetInnerHTML={{ __html: `try{if(sessionStorage.getItem("splash-seen")==="1")document.documentElement.dataset.splashSeen="1"}catch(e){}` }} /><Splash /><Header /><main>{children}</main><ManagerWidget />
    <Footer />
  </body></html>);
}

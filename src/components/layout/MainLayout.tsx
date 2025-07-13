import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ServiceBanner from "../ServiceBanner";

interface MainLayoutProps {
  children: React.ReactNode;
}

const BANNER_KEY = "service-banner-july-13-closed";

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  useEffect(() => {
    const bannerClosed = localStorage.getItem(BANNER_KEY);
    if (bannerClosed === "true") {
      setIsBannerVisible(false);
    }
  }, []);

  const closeBanner = () => {
    setIsBannerVisible(false);
    localStorage.setItem(BANNER_KEY, "true");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ServiceBanner onClose={closeBanner} isVisible={isBannerVisible} />
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;

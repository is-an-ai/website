import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ServiceBanner from "../ServiceBanner";
import { REGISTRAR_AT_CAPACITY } from "@/lib/constants";

interface MainLayoutProps {
  children: React.ReactNode;
}

const BANNER_KEY = "service-banner-july-13-closed";

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const atCapacity = REGISTRAR_AT_CAPACITY === true;

  useEffect(() => {
    if (!atCapacity) {
      const bannerClosed = localStorage.getItem(BANNER_KEY);
      if (bannerClosed === "true") {
        setIsBannerVisible(false);
      }
    } else {
      setIsBannerVisible(true);
    }
  }, [atCapacity]);

  const closeBanner = () => {
    if (atCapacity) {
      return; // Do not allow closing while at capacity
    }
    setIsBannerVisible(false);
    localStorage.setItem(BANNER_KEY, "true");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ServiceBanner
        onClose={atCapacity ? undefined : closeBanner}
        isVisible={isBannerVisible}
      />
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;

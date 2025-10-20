import Header from "@/components/layout/header";
import React from "react";
import { Raleway } from "next/font/google";
import { Karla } from "next/font/google";


const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const karla = Karla({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // jo weights chahiye
});

const Layout = ({ children }) => {
  return (
    <div className={`flex flex-col h-screen ${raleway.className}`}>
      {/* Sticky Header */}
      <header className="sticky top-0 z-50">
        <Header />
      </header>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth bg-[#f9f9f9] dark:bg-[#1e1e1e] transition-colors duration-300">
        {children}
      </main>
    </div>
  );
};

export default Layout;
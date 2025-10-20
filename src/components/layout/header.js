// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { privilegeConfig, privilegeOrder } from "@/constant/navigation";
// import Image from "next/image";
// import { useTheme } from "next-themes";
// import ThemeSwitcher from "@/themeSwitcher/ThemeSwitcher";

// export default function Header() {
//   const pathname = usePathname();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isDashboardDropdownOpen, setIsDashboardDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
//   const closeMenu = () => setIsMenuOpen(false);
//   const toggleDashboardDropdown = () =>
//     setIsDashboardDropdownOpen((prev) => !prev);
//   const closeDashboardDropdown = () => setIsDashboardDropdownOpen(false);

//   // 👇 Detect click outside dropdown
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         closeDashboardDropdown();
//       }
//     }

//     if (isDashboardDropdownOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isDashboardDropdownOpen]);

//   return (
//     <>
//       <header className="w-full bg-[#2b2b2b] text-white flex items-center justify-between px-2 sm:px-4 md:px-6 py-2 border-b border-gray-700 relative pb-0 pt-0">
//         {/* Left Section - Logo */}
//         <div className="flex items-center flex-shrink-0 pb-0 space-x-3">
//           <Image
//             src="/Pakistan_Navy_Admiral 1-fotor-bg-remover-20250530163220 1.png"
//             alt="Logo"
//             width={60}
//             height={50}
//             className="object-contain"
//           />
//         </div>

//         {/* Center Section - Navigation (Desktop) */}
//         <nav className="relative justify-center flex-1 hidden space-x-6 text-sm font-medium md:flex">
//           {privilegeOrder.map((key) => {
//             const item = privilegeConfig[key];
//             if (!item) return null;

//             const isActive = item.matchPaths?.some((path) =>
//               pathname.startsWith(path)
//             );

//             // Dashboard dropdown
//             if (item.label.toLowerCase() === "dashboard") {
//               return (
//                 <div key={key} className="relative" ref={dropdownRef}>
//                   <button
//                     onClick={toggleDashboardDropdown}
//                     className={`${
//                       isActive
//                         ? "text-[#f5c518]"
//                         : "text-gray-200 hover:text-[#f5c518]"
//                     } transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer`}
//                   >
//                     {item.label}
//                   </button>

//                   {isDashboardDropdownOpen && (
//                     <div className="absolute top-full mt-2 left-0 bg-[#2b2b2b] border border-gray-700 rounded-md shadow-lg w-56 z-20">
//                       <Link
//                         href="/dashboard"
//                         onClick={closeDashboardDropdown}
//                         className="block px-4 py-2 hover:bg-[#3a3a3a] text-gray-200 hover:text-[#f5c518] transition-colors"
//                       >
//                         Operator Level Dashboard
//                       </Link>
//                       <Link
//                         href="/engineer_level"
//                         onClick={closeDashboardDropdown}
//                         className="block px-4 py-2 hover:bg-[#3a3a3a] text-gray-200 hover:text-[#f5c518] transition-colors"
//                       >
//                         Engineer Level Dashboard
//                       </Link>
//                     </div>
//                   )}
//                 </div>
//               );
//             }

//             // Normal links
//             return (
//               <Link
//                 key={key}
//                 href={item.href}
//                 className={`${
//                   isActive
//                     ? "text-[#f5c518]"
//                     : "text-gray-200 hover:text-[#f5c518]"
//                 } transition-colors whitespace-nowrap`}
//               >
//                 {item.label}
//               </Link>
//             );
//           })}
//         </nav>

//         {/* Right Section - Icons */}
//         <div className="flex items-center flex-shrink-0 space-x-2 sm:space-x-4">
//           <ThemeSwitcher />
//           <Image
//             src="/majesticons_logout.png"
//             alt="Logout"
//             width={25}
//             height={20}
//             className="cursor-pointer hover:opacity-80"
//           />
//           <div className="w-px h-4 bg-gray-500"></div>
//           <Image
//             src="/solar_bell-bold.png"
//             alt="Notifications"
//             width={25}
//             height={20}
//             className="cursor-pointer hover:opacity-80"
//           />

//           {/* Hamburger Menu */}
//           <button
//             className="flex flex-col justify-center p-1 cursor-pointer md:hidden"
//             onClick={toggleMenu}
//             aria-label="Toggle menu"
//           >
//             <div className="w-5 h-0.5 bg-white mb-1"></div>
//             <div className="w-5 h-0.5 bg-white mb-1"></div>
//             <div className="w-5 h-0.5 bg-white"></div>
//           </button>
//         </div>
//       </header>

//       {/* Mobile Menu */}
//       {isMenuOpen && (
//         <div className="md:hidden bg-[#2b2b2b] border-b border-gray-700 z-10">
//           <nav className="flex flex-col p-4 space-y-2">
//             {privilegeOrder.map((key) => {
//               const item = privilegeConfig[key];
//               if (!item) return null;

//               const isActive = item.matchPaths?.some((path) =>
//                 pathname.startsWith(path)
//               );

//               if (item.label.toLowerCase() === "dashboard") {
//                 return (
//                   <div key={key} className="flex flex-col">
//                     <button
//                       onClick={toggleDashboardDropdown}
//                       className={`${
//                         isActive
//                           ? "text-[#f5c518]"
//                           : "text-gray-200 hover:text-[#f5c518]"
//                       } transition-colors py-2 px-4 flex justify-between items-center border-b border-gray-700`}
//                     >
//                       {item.label}
//                       <span className="text-xs">
//                         {isDashboardDropdownOpen ? "▲" : "▼"}
//                       </span>
//                     </button>

//                     {isDashboardDropdownOpen && (
//                       <div className="flex flex-col pl-4">
//                         <Link
//                           href="/dashboard"
//                           onClick={closeMenu}
//                           className="py-2 text-gray-200 hover:text-[#f5c518]"
//                         >
//                           Operator Level Dashboard
//                         </Link>
//                         <Link
//                           href="/engineer_level"
//                           onClick={closeMenu}
//                           className="py-2 text-gray-200 hover:text-[#f5c518]"
//                         >
//                           Engineer Level Dashboard
//                         </Link>
//                       </div>
//                     )}
//                   </div>
//                 );
//               }

//               return (
//                 <Link
//                   key={key}
//                   href={item.href}
//                   onClick={closeMenu}
//                   className={`${
//                     isActive
//                       ? "text-[#f5c518]"
//                       : "text-gray-200 hover:text-[#f5c518]"
//                   } transition-colors py-2 px-4 block border-b border-gray-700 last:border-b-0`}
//                 >
//                   {item.label}
//                 </Link>
//               );
//             })}
//           </nav>
//         </div>
//       )}
//     </>
//   );
// }

"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { privilegeConfig, privilegeOrder } from "@/constant/navigation";
import Image from "next/image";
import { useTheme } from "next-themes";
import ThemeSwitcher from "@/themeSwitcher/ThemeSwitcher";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDashboardDropdownOpen, setIsDashboardDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleDashboardDropdown = () =>
    setIsDashboardDropdownOpen((prev) => !prev);
  const closeDashboardDropdown = () => setIsDashboardDropdownOpen(false);

  // 👇 Detect click outside dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDashboardDropdown();
      }
    }

    if (isDashboardDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDashboardDropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    router.push("/");
  };

  return (
    <>
      <header className="w-full bg-[#2b2b2b] text-white flex items-center justify-between px-2 sm:px-4 md:px-6 py-2 border-b border-gray-700 relative pb-0 pt-0">
        {/* Left Section - Logo */}
        <div className="flex items-center flex-shrink-0 pb-0 space-x-3">
          <Image
            src="/Pakistan_Navy_Admiral 1-fotor-bg-remover-20250530163220 1.png"
            alt="Logo"
            width={60}
            height={50}
            className="object-contain"
          />
        </div>

        {/* Center Section - Navigation (Desktop) */}
        <nav className="relative justify-center flex-1 hidden space-x-6 text-sm font-medium md:flex">
          {privilegeOrder.map((key) => {
            const item = privilegeConfig[key];
            if (!item) return null;

            const isActive = item.matchPaths?.some((path) =>
              pathname.startsWith(path)
            );

            // Dashboard dropdown
            if (item.label.toLowerCase() === "dashboard") {
              return (
                <div key={key} className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDashboardDropdown}
                    className={`${
                      isActive
                        ? "text-[#f5c518]"
                        : "text-gray-200 hover:text-[#f5c518]"
                    } transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer`}
                  >
                    {item.label}
                  </button>

                  {isDashboardDropdownOpen && (
                    <div className="absolute top-full mt-2 left-0 bg-[#2b2b2b] border border-gray-700 rounded-md shadow-lg w-56 z-20">
                      <Link
                        href="/dashboard"
                        onClick={closeDashboardDropdown}
                        className="block px-4 py-2 hover:bg-[#3a3a3a] text-gray-200 hover:text-[#f5c518] transition-colors"
                      >
                        Operator Level Dashboard
                      </Link>
                      <Link
                        href="/engineer_level"
                        onClick={closeDashboardDropdown}
                        className="block px-4 py-2 hover:bg-[#3a3a3a] text-gray-200 hover:text-[#f5c518] transition-colors"
                      >
                        Engineer Level Dashboard
                      </Link>
                    </div>
                  )}
                </div>
              );
            }

            // Normal links
            return (
              <Link
                key={key}
                href={item.href}
                className={`${
                  isActive
                    ? "text-[#f5c518]"
                    : "text-gray-200 hover:text-[#f5c518]"
                } transition-colors whitespace-nowrap`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section - Icons */}
        <div className="flex items-center flex-shrink-0 space-x-2 sm:space-x-4">
          <ThemeSwitcher />
          <Image
            src="/majesticons_logout.png"
            alt="Logout"
            width={25}
            height={20}
            className="cursor-pointer hover:opacity-80"
            onClick={handleLogout}
          />
          <div className="w-px h-4 bg-gray-500"></div>
          <Image
            src="/solar_bell-bold.png"
            alt="Notifications"
            width={25}
            height={20}
            className="cursor-pointer hover:opacity-80"
          />

          {/* Hamburger Menu */}
          <button
            className="flex flex-col justify-center p-1 cursor-pointer md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-0.5 bg-white mb-1"></div>
            <div className="w-5 h-0.5 bg-white mb-1"></div>
            <div className="w-5 h-0.5 bg-white"></div>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#2b2b2b] border-b border-gray-700 z-10">
          <nav className="flex flex-col p-4 space-y-2">
            {privilegeOrder.map((key) => {
              const item = privilegeConfig[key];
              if (!item) return null;

              const isActive = item.matchPaths?.some((path) =>
                pathname.startsWith(path)
              );

              if (item.label.toLowerCase() === "dashboard") {
                return (
                  <div key={key} className="flex flex-col">
                    <button
                      onClick={toggleDashboardDropdown}
                      className={`${
                        isActive
                          ? "text-[#f5c518]"
                          : "text-gray-200 hover:text-[#f5c518]"
                      } transition-colors py-2 px-4 flex justify-between items-center border-b border-gray-700`}
                    >
                      {item.label}
                      <span className="text-xs">
                        {isDashboardDropdownOpen ? "▲" : "▼"}
                      </span>
                    </button>

                    {isDashboardDropdownOpen && (
                      <div className="flex flex-col pl-4">
                        <Link
                          href="/dashboard"
                          onClick={closeMenu}
                          className="py-2 text-gray-200 hover:text-[#f5c518]"
                        >
                          Operator Level Dashboard
                        </Link>
                        <Link
                          href="/engineer_level"
                          onClick={closeMenu}
                          className="py-2 text-gray-200 hover:text-[#f5c518]"
                        >
                          Engineer Level Dashboard
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={key}
                  href={item.href}
                  onClick={closeMenu}
                  className={`${
                    isActive
                      ? "text-[#f5c518]"
                      : "text-gray-200 hover:text-[#f5c518]"
                  } transition-colors py-2 px-4 block border-b border-gray-700 last:border-b-0`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}


// "use client";
// import React, { useState } from "react";
// import dynamic from "next/dynamic";
// import { Raleway } from "next/font/google";
// import LubricationPressure from "@/components/EngineerDashboard/lubricationPressure";
// import FuelCombustion from "@/components/EngineerDashboard/fuelCombustion";
// import PerformanceLoad from "@/components/EngineerDashboard/PerformanceLoad";
// import PerformanceGeneral from "@/components/EngineerDashboard/PerformanceGeneral";

// const raleway = Raleway({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });

// const ElectricalHealth = dynamic(
//   () => import("@/components/EngineerDashboard/electricalhealth"),
//   {
//     loading: () => (
//       <div className="flex items-center justify-center h-150">
//         <div className="loader"></div> 
//       </div>
//     ),
//     ssr: false,
//   }
// );

// const ThermalHealth = dynamic(
//   () => import("@/components/EngineerDashboard/thermalhealth"),
//   {
//     loading: () => (
//       <div className="flex items-center justify-center h-150">
//         <div className="loader"></div> 
//       </div>
//     ),
//     ssr: false,
//   }
// );



// export default function EngineerLevel() {
//   const [activeView, setActiveView] = useState("live");
//   const [activeTab, setActiveTab] = useState("electrical");
//   const [isLoading, setIsLoading] = useState(false);

//   const tabs = [
//     { id: "electrical", label: "Electrical Health" },
//     { id: "thermal", label: "Thermal Health" },
//     { id: "lubrication", label: "Lubrication & Pressure" },
//     { id: "fuel", label: "Fuel & Combustion" },
//     { id: "performance-general", label: "Performance (General)" },
//     { id: "performance-load", label: "Performance (Load)" },
//   ];

//   const handleTabChange = (tabId) => {
//     if (tabId === activeTab) return;
//     setIsLoading(true);
//     setActiveTab(tabId);
//     setTimeout(() => setIsLoading(false), 500);
//   };

//   const renderTabContent = () => {
//     if (isLoading) {
//       return (
//         <div className="flex items-center justify-center h-150">
//           <div className="loader"></div> {/* 👈 global loader */}
//         </div>
//       );
//     }

//     switch (activeTab) {
//       case "electrical":
//         return (
//           <div className="p-0 rounded-lg">
//             <ElectricalHealth />
//           </div>
//         );
//       case "thermal":
//         return (
//           <div className="p-0 rounded-lg">
//             <ThermalHealth />
//           </div>
//         );
//       case "lubrication":
//         return (
//           <div className="rounded-lg p-4-100 sm:p-0">
//             <LubricationPressure />
//           </div>
//         );
//       case "fuel":
//         return (
//           <div className="p-4 rounded-lg sm:p-0">
//             <FuelCombustion />
//           </div>
//         );
//       case "performance-general":
//         return (
//           <div className="p-4 rounded-lg sm:p-0">
//             <PerformanceGeneral />
//           </div>
//         );
//       case "performance-load":
//         return (
//           <div className="p-4 rounded-lg sm:p-0">
//             <PerformanceLoad />
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div
//       className={`min-h-screen dark:bg-[#1e1e1e] text-white p-4 sm:p-8 pt-4 sm:pt-5 ${raleway.className}`}
//     >
//       {/* Header */}
//       <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between sm:mb-2 sm:gap-0">
//         <div>
//           <h2 className="mb-2 text-xl font-semibold text-black sm:mb-4 sm:text-2xl dark:text-white">
//             Engineer Level Dashboard
//           </h2>
//         </div>

//         {/* Live / Historic */}
//         <div className="flex flex-col items-start gap-2 mb-0 text-xs sm:flex-row sm:items-center sm:gap-3 sm:mb-4 sm:text-sm">
//           <div className="flex w-full p-1 bg-black rounded-md dark:bg-white sm:w-auto">
//             <button
//               onClick={() => setActiveView("live")}
//               className={`flex-1 sm:px-4 py-1 sm:py-0 rounded font-small transition-colors cursor-pointer ${
//                 activeView === "live"
//                   ? " bg-white text-black dark:bg-[#2b2b2b] dark:text-white"
//                   : "bg-black text-white dark:bg-white dark:text-black"
//               }`}
//             >
//               Live
//             </button>
//             <button
//               onClick={() => setActiveView("historic")}
//               className={`flex-1 sm:px-4 py-1 sm:py-0.5 rounded font-medium transition-colors cursor-pointer ${
//                 activeView === "historic"
//                   ? "bg-white text-black dark:bg-[#2b2b2b] dark:text-white"
//                   : "bg-black text-white dark:bg-white dark:text-black"
//               }`}
//             >
//               Historic
//             </button>
//           </div>

//           {activeView === "historic" && (
//             <div className="flex flex-col items-start w-full gap-2 sm:flex-row sm:items-center sm:gap-2 sm:w-auto">
//               <span className="text-gray-400 whitespace-nowrap">Interval:</span>
//               <input
//                 type="date"
//                 defaultValue="2025-10-11"
//                 className="w-full px-2 py-1 text-black bg-white border border-gray-600 rounded sm:px-3 sm:w-auto"
//               />
//               <span className="hidden text-gray-400 whitespace-nowrap sm:inline">to</span>
//               <span className="text-gray-400 sm:hidden">→</span>
//               <input
//                 type="date"
//                 defaultValue="2025-10-11"
//                 className="w-full px-2 py-1 text-black bg-white border border-gray-600 rounded sm:px-3 sm:w-auto"
//               />
//             </div>
//           )}
//            <label className="relative inline-flex items-center self-start cursor-pointer sm:self-center">
//             <input type="checkbox" className="sr-only peer" />
//             <div className="w-10 sm:w-12 h-6 sm:h-7 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] sm:after:top-[4px] after:start-[1px] sm:after:start-[2px] after:bg-black after:border-gray-300 after:border after:rounded-full after:h-4 sm:after:h-5 after:w-4 sm:after:w-5 after:transition-all peer-checked:bg-white"></div>
//           </label>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="mb-4">
//   <div className="border bg-white dark:bg-[#323234] border-gray-200 rounded-sm dark:border-[#323234] overflow-hidden">
//     <div className="flex flex-wrap">
//       {tabs.map((tab) => (
//         <button
//           key={tab.id}
//           onClick={() => handleTabChange(tab.id)}
//           className={`relative flex-1 min-w-[50%] sm:min-w-[33.333%] lg:min-w-[16.666%] px-2 py-3 text-[10px] xs:text-xs sm:text-sm font-medium uppercase tracking-wide transition-colors cursor-pointer whitespace-nowrap ${
//             activeTab === tab.id
//               ? "bg-[#373324] text-yellow-500 dark:text-yellow-500 after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 border-b-4 border-[#F7D035]"
//               : "text-gray-500 dark:text-white hover:text-gray-300"
//           }`}
//         >
//           <span className="block w-full text-center truncate">{tab.label}</span>
//         </button>
//       ))}
//     </div>
//   </div>
// </div>

//       {/* Tab Content */}
//       <div className="mt-0 transition-all duration-300 ease-in-out">
//         {renderTabContent()}
//       </div>
//     </div>
//   );
// }



"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { Raleway } from "next/font/google";
import { FaCalendarAlt } from "react-icons/fa";
import { useTheme } from "next-themes";
import Switch from "react-switch";
import LubricationPressure from "@/components/EngineerDashboard/lubricationPressure";
import FuelCombustion from "@/components/EngineerDashboard/fuelCombustion";
import PerformanceLoad from "@/components/EngineerDashboard/PerformanceLoad";
import PerformanceGeneral from "@/components/EngineerDashboard/PerformanceGeneral";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ElectricalHealth = dynamic(
  () => import("@/components/EngineerDashboard/electricalhealth"),
  {
    loading: () => (
      <div className="flex items-center justify-center h-150">
        <div className="loader"></div> 
      </div>
    ),
    ssr: false,
  }
);

const ThermalHealth = dynamic(
  () => import("@/components/EngineerDashboard/thermalhealth"),
  {
    loading: () => (
      <div className="flex items-center justify-center h-150">
        <div className="loader"></div> 
      </div>
    ),
    ssr: false,
  }
);

export default function EngineerLevel() {
  const [activeView, setActiveView] = useState("live");
  const [activeTab, setActiveTab] = useState("electrical");
  const [isLoading, setIsLoading] = useState(false);
  const [isRange, setIsRange] = useState(false);

  const getCurrentDate = useCallback(() => new Date().toISOString().split('T')[0], []);
  const defaultDate = getCurrentDate();
  const [startDate, setStartDate] = useState(defaultDate);
  const [endDate, setEndDate] = useState(defaultDate);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  useEffect(() => {
    setStartDate(defaultDate);
    setEndDate(defaultDate);
  }, []); 

  useEffect(() => {
    const today = new Date();
    const maxDate = today.toISOString().split("T")[0];

    if (startDateRef.current) {
      startDateRef.current.max = maxDate;
    }

    if (endDateRef.current) {
      if (startDate) {
        const selectedStartDate = new Date(startDate);
        const minEndDate = selectedStartDate.toISOString().split("T")[0];

        endDateRef.current.min = minEndDate; 
        endDateRef.current.max = maxDate; 
      } else {
        endDateRef.current.removeAttribute("min");
        endDateRef.current.max = maxDate;
      }
    }
  }, [startDate]);

  // Effect to reset endDate if it's before startDate
  useEffect(() => {
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      setEndDate(startDate);
    }
  }, [startDate, endDate]);

  const tabs = [
    { id: "electrical", label: "Electrical Health" },
    { id: "thermal", label: "Thermal Health" },
    { id: "lubrication", label: "Lubrication & Pressure" },
    { id: "fuel", label: "Fuel & Combustion" },
    { id: "performance-general", label: "Performance (General)" },
    { id: "performance-load", label: "Performance (Load)" },
  ];

  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return;
    setIsLoading(true);
    setActiveTab(tabId);
    setTimeout(() => setIsLoading(false), 500);
  };

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-150">
          <div className="loader"></div> {/* 👈 global loader */}
        </div>
      );
    }

    // Common props for all child components
    const commonProps = {
      view: activeView,
      startDate: activeView === "historic" ? startDate : undefined,
      endDate: activeView === "historic" ? endDate : undefined,
      isRange,
    };

    switch (activeTab) {
      case "electrical":
        return (
          <div className="p-0 rounded-lg">
            <ElectricalHealth {...commonProps} />
          </div>
        );
      case "thermal":
        return (
          <div className="p-0 rounded-lg">
            <ThermalHealth {...commonProps} />
          </div>
        );
      case "lubrication":
        return (
          <div className="rounded-lg p-4-100 sm:p-0">
            <LubricationPressure {...commonProps} />
          </div>
        );
      case "fuel":
        return (
          <div className="p-4 rounded-lg sm:p-0">
            <FuelCombustion {...commonProps} />
          </div>
        );
      case "performance-general":
        return (
          <div className="p-4 rounded-lg sm:p-0">
            <PerformanceGeneral {...commonProps} />
          </div>
        );
      case "performance-load":
        return (
          <div className="p-4 rounded-lg sm:p-0">
            <PerformanceLoad {...commonProps} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen dark:bg-[#1e1e1e] text-white p-4 sm:p-8 pt-4 sm:pt-5 ${raleway.className}`}
    >
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 mb-1 sm:flex-row sm:items-center sm:gap-0">
        <div className="w-full sm:w-auto">
          <h2 className="mb-3 text-2xl font-semibold text-black dark:text-white">
            Engineer Level Dashboard
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-start w-full gap-3 mb-4 text-sm sm:w-auto sm:justify-end">
          <div className="flex w-full p-1 bg-black rounded-md dark:bg-white sm:w-auto">
            <button
              onClick={() => setActiveView("live")}
              className={`px-4 py-0 rounded font-small transition-colors cursor-pointer flex-1 sm:flex-none ${
                activeView === "live"
                  ? " bg-white text-black dark:bg-[#2b2b2b] dark:text-white"
                  : "bg-black text-white dark:bg-white dark:text-black"
              }`}
            >
              Live
            </button>
            <button
              onClick={() => setActiveView("historic")}
              className={`px-4 py-0.5 rounded font-medium transition-colors cursor-pointer flex-1 sm:flex-none ${
                activeView === "historic"
                  ? "bg-white text-black dark:bg-[#2b2b2b] dark:text-white"
                  : "bg-black text-white dark:bg-white dark:text-black"
              }`}
            >
              Historic
            </button>
          </div>

          {activeView === "historic" && (
            <div className="flex flex-col items-center w-full gap-2 sm:flex-row sm:w-auto">
              <span className="text-gray-400 whitespace-nowrap">Interval:</span>
              <div className="relative w-full sm:w-auto">
                <input
                  ref={startDateRef}
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full sm:w-[150px] md:w-[150px] px-3 py-1 pr-10 text-sm md:text-base text-black bg-white border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 cursor-pointer hide-calendar-icon"
                />
                <FaCalendarAlt
                  className="absolute text-gray-500 -translate-y-1/2 bg-black cursor-pointer text-md right-3 top-1/2 dark:text-white"
                  onClick={() => startDateRef.current?.showPicker()}
                />
              </div>

              <span className="hidden text-gray-400 whitespace-nowrap sm:inline">to</span>
              <div className="relative w-full sm:w-auto">
                <input
                  ref={endDateRef}
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full sm:w-[150px] md:w-[150px] px-3 py-1 pr-10 text-sm md:text-base text-black bg-white border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200 cursor-pointer hide-calendar-icon"
                />
                <FaCalendarAlt
                  className="absolute text-gray-500 -translate-y-1/2 bg-black cursor-pointer text-md right-3 top-1/2 dark:text-white"
                  onClick={() => endDateRef.current?.showPicker()}
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <Switch
                  onChange={setIsRange}
                  checked={isRange}
                  className="react-switch"
                  onColor="#ffffff"
                  offColor="#6B7280"
                  onHandleColor="#000000"
                  offHandleColor="#ffffff"
                  handleDiameter={20}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                  activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                  height={27}
                  width={50}
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <div className="border bg-white dark:bg-[#323234] border-gray-200 rounded-sm dark:border-[#323234] overflow-hidden">
          <div className="flex flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative flex-1 min-w-[50%] sm:min-w-[33.333%] lg:min-w-[16.666%] px-2 py-3 text-[10px] xs:text-xs sm:text-sm font-medium uppercase tracking-wide transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[#373324] text-yellow-500 dark:text-yellow-500 after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 border-b-4 border-[#F7D035]"
                    : "text-gray-500 dark:text-white hover:text-gray-300"
                }`}
              >
                <span className="block w-full text-center truncate">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-0 transition-all duration-300 ease-in-out">
        {renderTabContent()}
      </div>
    </div>
  );
}
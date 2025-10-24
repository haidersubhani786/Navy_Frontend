// "use client";
// import React, { useState, useEffect, useCallback } from "react";
// import { FaBatteryHalf, FaTachometerAlt, FaCogs, FaInfoCircle } from "react-icons/fa";
// import { Raleway } from "next/font/google";
// import { useTheme } from "next-themes";
// import GeneralOperator from "@/components/OperatorDashboard/GeneralOperator";
// import Image from "next/image";
// import { Karla } from "next/font/google";
// import GaugeChart from "@/components/GaugeChart";

// const karla = Karla({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });

// const raleway = Raleway({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });

// export default function OperatorDashboard() {
//   const [activeView, setActiveView] = useState("live");
//   const [isRange, setIsRange] = useState(false);

//   // Updated to date only
//   const defaultDate = "2025-10-16";
//   const [startDate, setStartDate] = useState(defaultDate);
//   const [endDate, setEndDate] = useState(defaultDate);

//   const [metrics, setMetrics] = useState({
//     load: 0,
//     rpm: 0,
//     runningHours: 0,
//     fuelConsumed: 0,
//     batteryVoltage: 0,
//     powerFactor: 0,
//     onDurationMinutes: 0,
//   });

//   const [runningMeterLoaded, setRunningMeterLoaded] = useState(false);
//   const [engineSpeedLoaded, setEngineSpeedLoaded] = useState(false);
//   const [loadMeterLoaded, setLoadMeterLoaded] = useState(false);
//   const [batteryLoaded, setBatteryLoaded] = useState(false);
//   const [pfLoaded, setPfLoaded] = useState(false);

//   const getQueryParams = useCallback(() => {
//     let params = new URLSearchParams({ mode: activeView });
//     if (activeView === "historic") {
//       // If user checked range OR selected a different end date, treat as a range
//       const useRange = isRange || (endDate && endDate !== startDate);
//       const currentMode = useRange ? 'range' : 'historic';
//       params = new URLSearchParams({ mode: currentMode });
//       // Use date inputs, append full day times
//       const start = `${startDate}T00:00:00+05:00`;
//       const endDateToUse = endDate || startDate;
//       const end = `${endDateToUse}T23:59:59+05:00`;
//       params.append("start", start);
//       params.append("end", end);
//     }
//     return params.toString();
//   }, [activeView, isRange, startDate, endDate]);

//   const fetchData = useCallback(async () => {
//     const paramsString = getQueryParams();
//     const url = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/operator-level?${paramsString}`;
//     try {
//       const res = await fetch(url);
//       if (res.ok) {
//         const data = await res.json();
//         setMetrics(data || {});
//       }
//     } catch (err) {
//       console.error("Error fetching data:", err);
//     }
//   }, [getQueryParams]);

//   useEffect(() => {
//     fetchData();
//     let interval;
//     if (activeView === "live") {
//       interval = setInterval(fetchData, 300000);
//     }
//     return () => {
//       if (interval) {
//         clearInterval(interval);
//       }
//     };
//   }, [fetchData, activeView]);

//   // Updated electricalStabilityConfig to match API response fields
//   const electricalStabilityConfig = [
//     { name: 'Voltage L1-L2', valueField: 'Genset_L1L2_Voltage', color: '#3B82F6', type: 'line' },
//     { name: 'Voltage L2-L3', valueField: 'Genset_L2L3_Voltage', color: '#8B5CF6', type: 'line' },
//     { name: 'Voltage L3-L1', valueField: 'Genset_L3L1_Voltage', color: '#06B6D4', type: 'line' },
//     { name: 'Genset Frequency', valueField: 'Genset_Frequency_OP_calculated', color: '#EF4444', type: 'line', yAxis: 'right' },
//   ];

//   const loadSharingConfig = [
//     { name: 'Phase A Load', valueField: 'Genset_L1_Current', color: '#10B981', type: 'line' },
//     { name: 'Phase B Load', valueField: 'Genset_L2_Current', color: '#F59E0B', type: 'line' },
//     { name: 'Phase C Load', valueField: 'Genset_L3_Current', color: '#EF4444', type: 'line' },
//   ];

//   const currentBalanceConfig = [
//     { name: 'Current Imbalance(%)', valueField: 'currentA', color: '#3B82F6', type: 'line' },
//     { name: 'Neutral Current', valueField: 'neutral', color: '#F59E0B', type: 'line' },
//   ];

//   const engineThermalConfig = [
//     { name: 'Coolant Temp', valueField: 'Coolant_Temperature', color: '#10B981', type: 'line' },
//     { name: 'Oil Temp', valueField: 'Oil_Temperature', color: '#F59E0B', type: 'line' },
//   ];

//   const lubePressureConfig = [
//     { name: 'Oil Pressure', valueField: 'Oil_Pressure', color: '#10B981', type: 'line' },
//   ];

//   const fuelDemandConfig = [
//     { name: 'Fuel Rate', valueField: 'Fuel_Rate', color: '#F59E0B', type: 'line' },
//   ];

//   const baseApiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/operator-level`; 

//   const Loader = () => (
//     <div className="flex items-center justify-center">
//       <div className="w-8 h-8 border-b-2 border-yellow-500 rounded-full animate-spin"></div>
//     </div>
//   );

//   const formatDuration = (minutes) => {
//     if (!minutes || minutes === 0) return '0 : 00';
//     const hours = Math.floor(minutes / 60);
//     const mins = Math.floor(minutes % 60);
//     return `${hours} : ${mins.toString().padStart(2, '0')}`;
//   };

//   return (
//     <div
//       className={`min-h-screen dark:bg-[#1e1e1e] text-white p-8 pt-4 ${raleway.className}`}
//     >
//      {/* Header */}
// <div className="flex flex-col items-start justify-between gap-4 mb-1 sm:flex-row sm:items-center sm:gap-0">
//   <div className="w-full sm:w-auto">
//     <h2 className="mb-3 text-2xl font-semibold text-black dark:text-white">
//       Operator Level Dashboard
//     </h2>
//     {/* <div className="inline-block border-b-4 border-yellow-500 rounded-sm">
//       <button className="bg-[#2b2b2b] dark:bg-[#373324] dark:text-yellow-500 text-yellow-500 px-6 py-5 text-sm font-medium uppercase tracking-wide">
//         OPERATIONAL DASHBOARD
//       </button>
//     </div> */}
//   </div>

//   <div className="flex flex-wrap items-center justify-start w-full gap-3 mb-4 text-sm sm:w-auto sm:justify-end">
//     <div className="flex w-full p-1 bg-black rounded-md dark:bg-white sm:w-auto">
//       <button
//         onClick={() => setActiveView("live")}
//         className={`px-4 py-0 rounded font-small transition-colors cursor-pointer flex-1 sm:flex-none ${
//           activeView === "live"
//             ? " bg-white text-black dark:bg-[#2b2b2b] dark:text-white"
//             : "bg-black text-white dark:bg-white dark:text-black"
//         }`}
//       >
//         Live
//       </button>
//       <button
//         onClick={() => setActiveView("historic")}
//         className={`px-4 py-0.5 rounded font-medium transition-colors cursor-pointer flex-1 sm:flex-none ${
//           activeView === "historic"
//             ? "bg-white text-black dark:bg-[#2b2b2b] dark:text-white"
//             : "bg-black text-white dark:bg-white dark:text-black"
//         }`}
//       >
//         Historic
//       </button>
//     </div>

//     {activeView === "historic" && (
//       <div className="flex flex-col items-center w-full gap-2 sm:flex-row sm:w-auto">
//         <span className="text-gray-400 whitespace-nowrap">Interval:</span>
//         <input
//           type="date"
//           value={startDate}
//           onChange={(e) => setStartDate(e.target.value)}
//           className="w-full px-3 py-1 text-black bg-white border border-gray-600 rounded sm:w-auto"
//         />
//         <span className="hidden text-gray-400 whitespace-nowrap sm:inline">to</span>
//         <input
//           type="date"
//           value={endDate}
//           onChange={(e) => setEndDate(e.target.value)}
//           className="w-full px-3 py-1 text-black bg-white border border-gray-600 rounded sm:w-auto"
//         />
//         <label className="relative inline-flex items-center cursor-pointer">
//           <input 
//             type="checkbox" 
//             className="sr-only peer" 
//             checked={isRange}
//             onChange={(e) => setIsRange(e.target.checked)}
//           />
//           <div className="w-12 h-7 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:start-[2px] after:bg-black after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
//         </label>
//       </div>
//     )}
//   </div>
// </div>

// {/* <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">Operational KPIs</h3> */}

// {/* Operational KPIs Section */}
// <div className="">
//   {/* KPI Cards Grid */}
//   <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
//     {/* Runtime */}
//   <div className="relative bg-[#333] rounded-lg p-4 text-center">
//   <p className="mt-2 mb-2 text-sm text-gray-300">Run Time since Last Service</p>
//   <div className="inline-block px-4 py-0 font-mono text-[31px] tracking-widest text-black bg-white rounded-sm" style={{ fontFamily: "Digital-7" }}>
//     {/* {formatDuration(metrics.onDurationMinutes || 0)} */}
//     185 : 30
//   </div>
//   <p className="mt-3 text-sm text-gray-300">Projected time to next service</p>
//   <div className="inline-block px-4 py-0 mt-2 font-mono text-[31px] tracking-widest text-black bg-white rounded-sm" style={{ fontFamily: "Digital-7" }}>
//     270 : 40
//   </div>
// </div>

//     {/* Running Hours */}
//     <div className="relative bg-[#333] rounded-lg p-3 text-center">
//   <FaInfoCircle className="absolute text-md text-[#a5a5a5] cursor-pointer top-3 right-3" />
//   <p className="mb-2 text-sm">Running Hours</p>
//   <div className="relative flex items-center justify-center h-32">
//     <GaugeChart 
//       value={metrics.runningHours ?? 0} 
//       minValue={0} 
//       maxValue={80} 
//       majorTickInterval={20}
//      minorTickInterval={5}
//     />
//   </div>
//   <button className="w-full px-2 py-1 mt-2 text-sm font-semibold text-black bg-white rounded hover:bg-white sm:w-auto">
//     Set Threshold
//   </button>
// </div>

//     {/* Engine Speed */}
//     <div className="relative bg-[#333] rounded-lg p-3 text-center">
//   <FaInfoCircle className="absolute text-md text-[#a5a5a5] cursor-pointer top-3 right-3" />
//   <p className="mb-2 text-sm">Engine Speed (RPM)</p>
//   <div className="relative flex items-center justify-center h-32">
//     <GaugeChart 
//       value={metrics.rpm ?? 0} 
//       minValue={0} 
//       maxValue={2000} 
//       majorTickInterval={600}
//       minorTickInterval={100}
//     />
//   </div>
//   <button className="w-full px-2 py-1 mt-2 text-sm font-semibold text-black bg-white rounded hover:bg-white sm:w-auto">
//     Set Threshold
//   </button>
// </div>

//     {/* Load */}
//     {/* Load - Ab Gauge Chart ke saath */}
// <div className="relative bg-[#333] rounded-lg p-3 text-center">
//   <FaInfoCircle className="absolute text-md text-[#a5a5a5] cursor-pointer top-3 right-3" />
//   <p className="mb-2 text-sm">Load (%)</p>
//   <div className="relative flex items-center justify-center h-32">
    
//     <GaugeChart 
//       value={metrics.load ?? 0} 
//       minValue={0} 
//       maxValue={80} 
//       majorTickInterval={20}
//      minorTickInterval={5}
//     />
//   </div>
//   <button className="w-full px-2 py-1 mt-2 text-sm font-semibold text-black bg-white rounded hover:bg-white sm:w-auto">
//     Set Threshold
//   </button>
// </div>

//     {/* Battery Voltage & Power Factor */}
//     <div className="bg-[#333] rounded-lg p-4 text-center flex space-x-0">
//       {/* Battery Voltage Section */}
//       <div className="flex-1">
//         <p className="mb-5 text-sm text-white">Battery Voltage</p>
//         <div className="relative flex items-center justify-center h-20 mb-2">
//           {!batteryLoaded && (
//             <div className="absolute inset-0 flex items-center justify-center bg-[#333] rounded">
//               <Loader />
//             </div>
//           )}
//           <Image
//             src="/battery.png"
//             alt="Battery"
//             width={30}
//             height={10}
//             className="object-contain w-full h-auto max-w-[50px]"
//             style={{ opacity: batteryLoaded ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}
//             onLoadingComplete={() => setBatteryLoaded(true)}
//           />
//         </div>
//         <p className={`mt-5 text-xl font-semibold text-white ${karla.className}`}>{(metrics.batteryVoltage ?? 0).toFixed(1)} V</p>
//       </div>

//       {/* Power Factor Section */}
//       <div className="flex-1">
//         <p className="mb-5 text-sm text-white">Power Factor</p>
//         <div className="relative flex items-center justify-center h-20 mb-5">
//           {!pfLoaded && (
//             <div className="absolute inset-0 flex items-center justify-center bg-[#333] rounded">
//               <Loader />
//             </div>
//           )}
//           <Image
//             src="/pf.png"
//             alt="Power Factor"
//             width={130}
//             height={50}
//             className="object-contain w-full h-auto max-w-[80px]"
//             style={{ opacity: pfLoaded ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}
//             onLoadingComplete={() => setPfLoaded(true)}
//           />
//         </div>
//         <p className={`text-xl font-semibold text-white ${karla.className}`}>
//           {(metrics.powerFactor ?? 0).toFixed(2)}
//         </p>
//       </div>
//     </div>

//     {/* Total Hours */}
//     <div className="bg-[#333] rounded-lg p-3 text-center">
//   <p className="mt-2 mb-2 text-sm text-gray-300">Total Hours</p>

//   {/* Total Hours Value */}
//   <div className="py-0 font-mono text-[31px] tracking-widest text-black bg-white rounded-sm w-[170px] mx-auto overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontFamily: "Digital-7" }}>
//     9000  :  15
//   </div>

//   <p className="mt-3 text-sm text-gray-300">Fuel Consumed</p>

//   {/* Fuel Consumed Value */}
//   <div className="py-0 font-mono text-[31px] tracking-widest text-black bg-white rounded-sm w-[170px] mx-auto overflow-hidden text-ellipsis whitespace-nowrap mt-2" style={{ fontFamily: "Digital-7" }}>
//     {(metrics.fuelConsumed ?? 0).toFixed(2)} L
//   </div>
// </div>


//   </div>
// </div>

//       {/* Charts Section - Generator Performance Details */}
//       <div className="mt-4">
//         <h3 className="mb-3 text-xl font-semibold">Generator Performance Details</h3>
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
//           <GeneralOperator
//             title="Electrical Stability"
//             chartId="electrical-stability"
//             seriesConfig={electricalStabilityConfig}
//             apiUrl={`${baseApiUrl}/electrical-stability`}
//             queryParams={getQueryParams()}
//             yAxisTitleLeft="Voltage (V)"
//             yAxisTitleRight="Frequency (Hz)"
//             showMarkers={true}
//             extraPayload={{ type: 'generator' }}
//           />
//           <GeneralOperator
//             title="Load Sharing Across Phases"
//             chartId="load-sharing"
//             seriesConfig={loadSharingConfig}
//             apiUrl={`${baseApiUrl}/load-sharing`}
//             queryParams={getQueryParams()}
//             yAxisTitleLeft="Load (%)"
//             showMarkers={true}
//             extraPayload={{ type: 'generator' }}
//           />
//           <GeneralOperator
//             title="Current Balance and Neutral Loading"
//             chartId="current-balance"
//             seriesConfig={currentBalanceConfig}
//             apiUrl={`${baseApiUrl}/current-balance`}
//             queryParams={getQueryParams()}
//             yAxisTitleLeft="Current Imbalance(%)"
//             yAxisTitleRight="Neutral Current"
//             extraPayload={{ type: 'generator' }}
//           />
//           <GeneralOperator
//             title="Engine Thermal Performance"
//             chartId="engine-thermal"
//             seriesConfig={engineThermalConfig}
//             apiUrl={`${baseApiUrl}/engine-thermal`}
//             queryParams={getQueryParams()}
//             yAxisTitleLeft="Coolent Temperature"
//             yAxisTitleRight="Oil Temperature"
//             extraPayload={{ type: 'generator' }}
//           />
//           <GeneralOperator
//             title="Lubrication System Pressure"
//             chartId="lube-pressure"
//             seriesConfig={lubePressureConfig}
//             apiUrl={`${baseApiUrl}/lube-pressure`}
//             queryParams={getQueryParams()}
//             yAxisTitleLeft="Oil Pressure"
//             extraPayload={{ type: 'generator' }}
//           />
//           <GeneralOperator
//             title="Fuel Demand"
//             chartId="fuel-demand"
//             seriesConfig={fuelDemandConfig}
//             apiUrl={`${baseApiUrl}/fuel-demand`}
//             queryParams={getQueryParams()}
//             yAxisTitleLeft="Fuel Rate"
//             extraPayload={{ type: 'generator' }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";
// import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
// import { FaBatteryHalf, FaTachometerAlt, FaCogs, FaInfoCircle, FaCalendarAlt } from "react-icons/fa";
// import { Raleway } from "next/font/google";
// import { useTheme } from "next-themes";
// import GeneralOperator from "@/components/OperatorDashboard/GeneralOperator";
// import Image from "next/image";
// import { Karla } from "next/font/google";
// import GaugeChart from "@/components/GaugeChart";
// import Switch from "react-switch";

// const karla = Karla({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });

// const raleway = Raleway({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });

// const electricalStabilityConfig = [
//   { name: 'Voltage L1-L2', valueField: 'Genset_L1L2_Voltage', color: '#3B82F6', type: 'line' },
//   { name: 'Voltage L2-L3', valueField: 'Genset_L2L3_Voltage', color: '#8B5CF6', type: 'line' },
//   { name: 'Voltage L3-L1', valueField: 'Genset_L3L1_Voltage', color: '#06B6D4', type: 'line' },
//   { name: 'Genset Frequency', valueField: 'Genset_Frequency_OP_calculated', color: '#EF4444', type: 'line', yAxis: 'right' },
// ];

// const loadSharingConfig = [
//   { name: 'Phase A Load', valueField: 'Genset_L1_Current', color: '#10B981', type: 'line' },
//   { name: 'Phase B Load', valueField: 'Genset_L2_Current', color: '#F59E0B', type: 'line' },
//   { name: 'Phase C Load', valueField: 'Genset_L3_Current', color: '#EF4444', type: 'line' },
// ];

// const currentBalanceConfig = [
//   { name: 'Current Imbalance(%)', valueField: 'currentA', color: '#3B82F6', type: 'line' },
//   { name: 'Neutral Current', valueField: 'neutral', color: '#F59E0B', type: 'line' },
// ];

// const engineThermalConfig = [
//   { name: 'Coolant Temp', valueField: 'Coolant_Temperature', color: '#10B981', type: 'line' },
//   { name: 'Oil Temp', valueField: 'Oil_Temperature', color: '#F59E0B', type: 'line' },
// ];

// const lubePressureConfig = [
//   { name: 'Oil Pressure', valueField: 'Oil_Pressure', color: '#10B981', type: 'line' },
// ];

// const fuelDemandConfig = [
//   { name: 'Fuel Rate', valueField: 'Fuel_Rate', color: '#F59E0B', type: 'line' },
// ];

// export default function OperatorDashboard() {
//   const [activeView, setActiveView] = useState("live");
//   const [isRange, setIsRange] = useState(false);

//   const getCurrentDate = useCallback(() => new Date().toISOString().split('T')[0], []);
//   const defaultDate = getCurrentDate();
//   const [startDate, setStartDate] = useState(defaultDate);
//   const [endDate, setEndDate] = useState(defaultDate);
//   const startDateRef = useRef(null);
//   const endDateRef = useRef(null);

//   useEffect(() => {
//     setStartDate(defaultDate);
//     setEndDate(defaultDate);
//   }, []); 

//   const [metrics, setMetrics] = useState({
//     load: 0,
//     rpm: 0,
//     runningHours: 0,
//     fuelConsumed: 0,
//     batteryVoltage: 0,
//     powerFactor: 0,
//     onDurationMinutes: 0,
//   });

//   const [runningMeterLoaded, setRunningMeterLoaded] = useState(false);
//   const [engineSpeedLoaded, setEngineSpeedLoaded] = useState(false);
//   const [loadMeterLoaded, setLoadMeterLoaded] = useState(false);
//   const [batteryLoaded, setBatteryLoaded] = useState(false);
//   const [pfLoaded, setPfLoaded] = useState(false);

//   const getQueryParams = useCallback(() => {
//     let params = new URLSearchParams({ mode: activeView });
//     if (activeView === "historic") {
//       const useRange = isRange || (endDate && endDate !== startDate);
//       const currentMode = useRange ? 'range' : 'historic';
//       params = new URLSearchParams({ mode: currentMode });
//       const start = `${startDate}T00:00:00+05:00`;
//       const endDateToUse = endDate || startDate;
//       const end = `${endDateToUse}T23:59:59+05:00`;
//       params.append("start", start);
//       params.append("end", end);
//     }
//     return params.toString();
//   }, [activeView, isRange, startDate, endDate]);

//   const fetchData = useCallback(async () => {
//     const paramsString = getQueryParams();
//     const url = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/operator-level?${paramsString}`;
//     try {
//       const res = await fetch(url);
//       if (res.ok) {
//         const data = await res.json();
//         setMetrics(data || {});
//       }
//     } catch (err) {
//       console.error("Error fetching data:", err);
//     }
//   }, [getQueryParams]);

//   const baseApiUrl = useMemo(() => `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/operator-level`, []);

//   useEffect(() => {
//     fetchData();
//     let interval;
//     if (activeView === "live") {
//       interval = setInterval(fetchData, 30000); // 5 minutes
//     }
//     return () => {
//       if (interval) {
//         clearInterval(interval);
//       }
//     };
//   }, [fetchData, activeView]);

//   const Loader = useMemo(() => () => (
//     <div className="flex items-center justify-center">
//       <div className="w-8 h-8 border-b-2 border-yellow-500 rounded-full animate-spin"></div>
//     </div>
//   ), []);

//   const formatDuration = useCallback((minutes) => {
//     if (!minutes || minutes === 0) return '0 : 00';
//     const hours = Math.floor(minutes / 60);
//     const mins = Math.floor(minutes % 60);
//     return `${hours} : ${mins.toString().padStart(2, '0')}`;
//   }, []);

//   useEffect(() => {
//     const today = new Date();
//     const maxDate = today.toISOString().split("T")[0];

//     if (startDateRef.current) {
//       startDateRef.current.max = maxDate;
//     }

//     if (endDateRef.current) {
//       if (startDate) {
//         const selectedStartDate = new Date(startDate);
//         const minEndDate = selectedStartDate.toISOString().split("T")[0];

//         endDateRef.current.min = minEndDate; 
//         endDateRef.current.max = maxDate; 
//       } else {
//         endDateRef.current.removeAttribute("min");
//         endDateRef.current.max = maxDate;
//       }
//     }
//   }, [startDate]);

//   const chartQueryParams = useMemo(() => getQueryParams(), [getQueryParams]);

//   const extraPayload = useMemo(() => ({ type: 'generator' }), []);

//   return (
//     <div
//       className={`min-h-screen dark:bg-[#1e1e1e] text-white p-8 pt-4 ${raleway.className}`}
//     >
//       {/* Header */}
//       <div className="flex flex-col items-start justify-between gap-4 mb-1 sm:flex-row sm:items-center sm:gap-0">
//         <div className="w-full sm:w-auto">
//           <h2 className="mb-3 text-2xl font-semibold text-black dark:text-white">
//             Operator Level Dashboard
//           </h2>
//         </div>

//         <div className="flex flex-wrap items-center justify-start w-full gap-3 mb-4 text-sm sm:w-auto sm:justify-end">
//           <div className="flex w-full p-1 bg-black rounded-md dark:bg-white sm:w-auto">
//             <button
//               onClick={() => setActiveView("live")}
//               className={`px-4 py-0 rounded font-small transition-colors cursor-pointer flex-1 sm:flex-none ${
//                 activeView === "live"
//                   ? " bg-white text-black dark:bg-[#2b2b2b] dark:text-white"
//                   : "bg-black text-white dark:bg-white dark:text-black"
//               }`}
//             >
//               Live
//             </button>
//             <button
//               onClick={() => setActiveView("historic")}
//               className={`px-4 py-0.5 rounded font-medium transition-colors cursor-pointer flex-1 sm:flex-none ${
//                 activeView === "historic"
//                   ? "bg-white text-black dark:bg-[#2b2b2b] dark:text-white"
//                   : "bg-black text-white dark:bg-white dark:text-black"
//               }`}
//             >
//               Historic
//             </button>
//           </div>

//           {activeView === "historic" && (
//             <div className="flex flex-col items-center w-full gap-2 sm:flex-row sm:w-auto">
//               <span className="text-gray-400 whitespace-nowrap">Interval:</span>
//               <div className="relative w-full sm:w-auto">
//                 <input
//                   ref={startDateRef}
//                   type="date"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                   className="w-full sm:w-[150px] md:w-[150px] px-3 py-1 pr-10 text-sm md:text-base text-black bg-white border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 cursor-pointer hide-calendar-icon"
//                 />
//                 <FaCalendarAlt
//                   className="absolute text-gray-500 -translate-y-1/2 bg-black cursor-pointer text-md right-3 top-1/2 dark:text-white"
//                   onClick={() => startDateRef.current?.showPicker()}
//                 />
//               </div>

//               <span className="hidden text-gray-400 whitespace-nowrap sm:inline">to</span>
//               <div className="relative w-full sm:w-auto">
//                 <input
//                   ref={endDateRef}
//                   type="date"
//                   value={endDate}
//                   onChange={(e) => setEndDate(e.target.value)}
//                   className="w-full sm:w-[150px] md:w-[150px] px-3 py-1 pr-10 text-sm md:text-base text-black bg-white border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200 cursor-pointer hide-calendar-icon"
//                 />
//                 <FaCalendarAlt
//                   className="absolute text-gray-500 -translate-y-1/2 bg-black cursor-pointer text-md right-3 top-1/2 dark:text-white"
//                   onClick={() => endDateRef.current?.showPicker()}
//                 />
//               </div>

//               <label className="flex items-center gap-2 cursor-pointer">
//                 <Switch
//                   onChange={setIsRange}
//                   checked={isRange}
//                   className="react-switch"
//                   onColor="#ffffff"
//                   offColor="#6B7280"
//                   onHandleColor="#000000"
//                   offHandleColor="#ffffff"
//                   handleDiameter={20}
//                   uncheckedIcon={false}
//                   checkedIcon={false}
//                   boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
//                   activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
//                   height={27}
//                   width={50}
//                 />
//               </label>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Operational KPIs Section */}
//       <div className="">
//         {/* KPI Cards Grid */}
//         <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
//           {/* Runtime */}
//           <div className="relative bg-[#333] rounded-lg p-4 text-center">
//             <p className="mt-2.5 mb-2 text-sm text-gray-300">Run Time since Last Service</p>
//             <div className="inline-block px-4 py-0 font-mono text-[31px] tracking-widest text-black bg-white rounded-sm" style={{ fontFamily: "Digital-7" }}>
//               {/* {formatDuration(metrics.onDurationMinutes || 0)} */}
//               185 : 30
//             </div>
//             <p className="mt-3 text-sm text-gray-300">Projected time to next service</p>
//             <div className="inline-block px-4 py-0 mt-2 font-mono text-[31px] tracking-widest text-black bg-white rounded-sm" style={{ fontFamily: "Digital-7" }}>
//               270 : 40
//             </div>
//           </div>

//           {/* Running Hours */}
//           <div className="relative bg-[#333] rounded-lg p-3 text-center">
//             <FaInfoCircle className="absolute text-md text-[#a5a5a5] cursor-pointer top-3 right-3" />
//             <p className="mb-2 text-sm">Running Hours</p>
//             <div className="relative flex items-center justify-center h-32">
//               <GaugeChart 
//                 value={metrics.runningHours ?? 0} 
//                 minValue={0} 
//                 maxValue={80} 
//                 majorTickInterval={20}
//                 minorTickInterval={5}
//               />
//             </div>
//             <button className="w-full px-2 py-1 mt-2 text-sm font-semibold text-black bg-white rounded hover:bg-white sm:w-auto">
//               Set Threshold
//             </button>
//           </div>

//           {/* Engine Speed */}
//           <div className="relative bg-[#333] rounded-lg p-3 text-center">
//             <FaInfoCircle className="absolute text-md text-[#a5a5a5] cursor-pointer top-3 right-3" />
//             <p className="mb-2 text-sm">Engine Speed (RPM)</p>
//             <div className="relative flex items-center justify-center h-32">
//               <GaugeChart 
//                 value={metrics.rpm ?? 0} 
//                 minValue={0} 
//                 maxValue={2000} 
//                 majorTickInterval={600}
//                 minorTickInterval={100}
//               />
              
//             </div>
//             <button className="w-full px-2 py-1 mt-2 text-sm font-semibold text-black bg-white rounded hover:bg-white sm:w-auto">
//               Set Threshold
//             </button>
//           </div>

//           {/* Load */}
//           <div className="relative bg-[#333] rounded-lg p-3 text-center">
//             <FaInfoCircle className="absolute text-md text-[#a5a5a5] cursor-pointer top-3 right-3" />
//             <p className="mb-2 text-sm">Load (%)</p>
//             <div className="relative flex items-center justify-center h-32">
//               <GaugeChart 
//                 value={metrics.load ?? 0} 
//                 minValue={0} 
//                 maxValue={80} 
//                 majorTickInterval={20}
//                 minorTickInterval={5}
//               />
//             </div>
//             <button className="w-full px-2 py-1 mt-2 text-sm font-semibold text-black bg-white rounded hover:bg-white sm:w-auto">
//               Set Threshold
//             </button>
//           </div>

//           {/* Battery Voltage & Power Factor */}
//           <div className="bg-[#333] rounded-lg p-4 text-center flex space-x-0">
//             {/* Battery Voltage Section */}
//             <div className="flex-1">
//               <p className="text-sm text-white mb-7">Battery Voltage</p>
//               <div className="relative flex items-center justify-center h-20 mb-2">
//                 {!batteryLoaded && (
//                   <div className="absolute inset-0 flex items-center justify-center bg-[#333] rounded">
//                     <Loader />
//                   </div>
//                 )}
//                 <Image
//                   src="/battery.png"
//                   alt="Battery"
//                   width={30}
//                   height={10}
//                   className="object-contain w-full h-auto max-w-[55px]"
//                   style={{ opacity: batteryLoaded ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}
//                   onLoadingComplete={() => setBatteryLoaded(true)}
//                   loading="lazy" 
//                 />
//               </div>
//               <p className={`mt-5 text-xl font-semibold text-white ${karla.className}`}>{(metrics.batteryVoltage ?? 0).toFixed(1)} V</p>
//             </div>

//             {/* Power Factor Section */}
//             <div className="flex-1">
//               <p className="text-sm text-white mb-7">Power Factor</p>
//               <div className="relative flex items-center justify-center h-20 mb-5">
//                 {!pfLoaded && (
//                   <div className="absolute inset-0 flex items-center justify-center bg-[#333] rounded">
//                     <Loader />
//                   </div>
//                 )}
//                 <Image
//                   src="/pf.png"
//                   alt="Power Factor"
//                   width={130}
//                   height={50}
//                   className="object-contain w-full h-auto max-w-[80px]"
//                   style={{ opacity: pfLoaded ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}
//                   onLoadingComplete={() => setPfLoaded(true)}
//                   loading="lazy"
//                 />
//               </div>
//               <p className={`text-xl font-semibold text-white ${karla.className}`}>
//                 {(metrics.powerFactor ?? 0).toFixed(2)}
//               </p>
//             </div>
//           </div>

//           {/* Total Hours */}
//           <div className="bg-[#333] rounded-lg p-3 text-center">
//             <p className="mt-2.5 mb-2 text-sm text-gray-300">Total Hours</p>
//             <div className="py-0 font-mono text-[31px] tracking-widest text-black bg-white rounded-sm w-[170px] mx-auto overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontFamily: "Digital-7" }}>
//               9000  :  15
//             </div>
//             <p className="mt-3 text-sm text-gray-300">Fuel Consumed</p>
//             <div className="py-0 font-mono text-[31px] tracking-widest text-black bg-white rounded-sm w-[170px] mx-auto overflow-hidden text-ellipsis whitespace-nowrap mt-2" style={{ fontFamily: "Digital-7" }}>
//               {(metrics.fuelConsumed ?? 0).toFixed(2)} L
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Charts Section - Generator Performance Details */}
//       <div className="mt-4">
//         <h3 className="mb-3 text-xl font-semibold">Generator Performance Details</h3>
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
//           <GeneralOperator
//             title="Electrical Stability"
//             chartId="electrical-stability"
//             seriesConfig={electricalStabilityConfig}
//             apiUrl={`${baseApiUrl}/electrical-stability`}
//             queryParams={chartQueryParams}
//             yAxisTitleLeft="Voltage (V)"
//             yAxisTitleRight="Frequency (Hz)"
//             showMarkers={true}
//             extraPayload={extraPayload}
//           />
//           <GeneralOperator
//             title="Load Sharing Across Phases"
//             chartId="load-sharing"
//             seriesConfig={loadSharingConfig}
//             apiUrl={`${baseApiUrl}/load-sharing`}
//             queryParams={chartQueryParams}
//             yAxisTitleLeft="Load (%)"
//             showMarkers={true}
//             extraPayload={extraPayload}
//           />
//           <GeneralOperator
//             title="Current Balance and Neutral Loading"
//             chartId="current-balance"
//             seriesConfig={currentBalanceConfig}
//             apiUrl={`${baseApiUrl}/current-balance`}
//             queryParams={chartQueryParams}
//             yAxisTitleLeft="Current Imbalance(%)"
//             yAxisTitleRight="Neutral Current"
//             extraPayload={extraPayload}
//           />
//           <GeneralOperator
//             title="Engine Thermal Performance"
//             chartId="engine-thermal"
//             seriesConfig={engineThermalConfig}
//             apiUrl={`${baseApiUrl}/engine-thermal`}
//             queryParams={chartQueryParams}
//             yAxisTitleLeft="Coolent Temperature"
//             yAxisTitleRight="Oil Temperature"
//             extraPayload={extraPayload}
//           />
//           <GeneralOperator
//             title="Lubrication System Pressure"
//             chartId="lube-pressure"
//             seriesConfig={lubePressureConfig}
//             apiUrl={`${baseApiUrl}/lube-pressure`}
//             queryParams={chartQueryParams}
//             yAxisTitleLeft="Oil Pressure"
//             extraPayload={extraPayload}
//           />
//           <GeneralOperator
//             title="Fuel Demand"
//             chartId="fuel-demand"
//             seriesConfig={fuelDemandConfig}
//             apiUrl={`${baseApiUrl}/fuel-demand`}
//             queryParams={chartQueryParams}
//             yAxisTitleLeft="Fuel Rate"
//             extraPayload={extraPayload}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { FaBatteryHalf, FaTachometerAlt, FaCogs, FaInfoCircle, FaCalendarAlt } from "react-icons/fa";
import { Raleway } from "next/font/google";
import { useTheme } from "next-themes";
import GeneralOperator from "@/components/OperatorDashboard/GeneralOperator";
import Image from "next/image";
import { Karla } from "next/font/google";
import GaugeChart from "@/components/GaugeChart";
import Switch from "react-switch";

const karla = Karla({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const electricalStabilityConfig = [
  { name: 'Voltage L1-L2', valueField: 'Genset_L1L2_Voltage', color: '#D25250', type: 'line' },
  { name: 'Voltage L2-L3', valueField: 'Genset_L2L3_Voltage', color: '#DFBB4E', type: 'line' },
  { name: 'Voltage L3-L1', valueField: 'Genset_L3L1_Voltage', color: '#159089', type: 'line' },
  { name: 'Genset Frequency', valueField: 'Genset_Frequency_OP_calculated', color: '#4169E1', type: 'line', yAxis: 'right' },
];

const loadSharingConfig = [
  { name: 'Phase A Load', valueField: 'Genset_L1_Current', color: '#828933', type: 'line' },
  { name: 'Phase B Load', valueField: 'Genset_L2_Current', color: '#E75956', type: 'line' },
  { name: 'Phase C Load', valueField: 'Genset_L3_Current', color: '#20B2AA', type: 'line' },
];

const currentBalanceConfig = [
  { name: 'Current Imbalance(%)', valueField: 'CurrentImbalance', color: '#5A895C', type: 'line' },
  { name: 'Neutral Current', valueField: 'neutralCurrent', color: '#CA49A7', type: 'line', yAxis: 'right' },
];

const engineThermalConfig = [
  { name: 'Coolant Temp', valueField: 'Coolant_Temperature', color: '#E75956', type: 'line' },
  { name: 'Oil Temp', valueField: 'Oil_Temperature', color: '#828933', type: 'line', yAxis: 'right' },
];

const lubePressureConfig = [
  { name: 'Oil Pressure', valueField: 'Oil_Pressure', color: '#4169E1', type: 'line' },
];

const fuelDemandConfig = [
  { name: 'Fuel Rate', valueField: 'Fuel_Rate', color: '#159089', type: 'line' },
];

export default function OperatorDashboard() {
  const [activeView, setActiveView] = useState("live");
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

  const [metrics, setMetrics] = useState({
    load: 0,
    rpm: 0,
    runningHours: 0,
    fuelConsumed: 0,
    batteryVoltage: 0,
    powerFactor: 0,
    onDurationMinutes: 0,
  });

  const [runningMeterLoaded, setRunningMeterLoaded] = useState(false);
  const [engineSpeedLoaded, setEngineSpeedLoaded] = useState(false);
  const [loadMeterLoaded, setLoadMeterLoaded] = useState(false);
  const [batteryLoaded, setBatteryLoaded] = useState(false);
  const [pfLoaded, setPfLoaded] = useState(false);

  const getQueryParams = useCallback(() => {
    let params = new URLSearchParams({ mode: activeView });
    if (activeView === "historic") {
      const useRange = isRange || (endDate && endDate !== startDate);
      const currentMode = useRange ? 'range' : 'historic';
      params = new URLSearchParams({ mode: currentMode });
      const start = `${startDate}T00:00:00+05:00`;
      const endDateToUse = endDate || startDate;
      const end = `${endDateToUse}T23:59:59+05:00`;
      params.append("start", start);
      params.append("end", end);
    }
    return params.toString();
  }, [activeView, isRange, startDate, endDate]);

  const fetchData = useCallback(async () => {
    const paramsString = getQueryParams();
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/operator-level?${paramsString}`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setMetrics(data || {});
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }, [getQueryParams]);

  const baseApiUrl = useMemo(() => `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/operator-level`, []);
  
  useEffect(() => {
    fetchData();
    let interval;
    if (activeView === "live") {
      interval = setInterval(fetchData, 30000); 
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [fetchData, activeView]);

  const Loader = useMemo(() => () => (
    <div className="flex items-center justify-center">
      <div className="w-8 h-8 border-b-2 border-yellow-500 rounded-full animate-spin"></div>
    </div>
  ), []);

  const formatDuration = useCallback((minutes) => {
    if (!minutes || minutes === 0) return '0 : 00';
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours} : ${mins.toString().padStart(2, '0')}`;
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

  const chartQueryParams = useMemo(() => getQueryParams(), [getQueryParams]);

  const extraPayload = useMemo(() => ({ type: 'generator' }), []);

  return (
    <div
      className={`min-h-screen dark:bg-[#1e1e1e] text-white p-8 pt-4 ${raleway.className}`}
    >
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 mb-1 sm:flex-row sm:items-center sm:gap-0">
        <div className="w-full sm:w-auto">
          <h2 className="mb-3 text-2xl font-semibold text-black dark:text-white">
            Operator Level Dashboard
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

      {/* Operational KPIs Section */}
      <div className="">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {/* Runtime */}
          <div className="relative bg-[#333] rounded-lg p-4 text-center">
            <p className="mt-2.5 mb-2 text-sm text-gray-300">Run Time since Last Service</p>
            <div className="inline-block px-4 py-0 font-mono text-[31px] tracking-widest text-black bg-white rounded-sm" style={{ fontFamily: "Digital-7" }}>
              {/* {formatDuration(metrics.onDurationMinutes || 0)} */}
              185 : 30
            </div>
            <p className="mt-3 text-sm text-gray-300">Projected time to next service</p>
            <div className="inline-block px-4 py-0 mt-2 font-mono text-[31px] tracking-widest text-black bg-white rounded-sm" style={{ fontFamily: "Digital-7" }}>
              270 : 40
            </div>
          </div>

          {/* Running Hours */}
          <div className="relative bg-[#333] rounded-lg p-3 text-center">
            <FaInfoCircle className="absolute text-md text-[#a5a5a5] cursor-pointer top-3 right-3" />
            <p className="mb-2 text-sm">Running Hours</p>
            <div className="relative flex items-center justify-center h-32">
              <GaugeChart 
                // value={metrics.runningHours ?? 0} 
                minValue={0} 
                maxValue={80} 
                majorTickInterval={20}
                minorTickInterval={5}
              />
            </div>
            <p className="w-[49%] px-2 py-0.5 mt-2 text-center text-md font-semibold text-black bg-white rounded ml-14" style={{ fontFamily: "Digital-7" }}>{(metrics.runningHours ?? 0).toFixed(1)}</p>
          </div>

          {/* Engine Speed */}
          <div className="relative bg-[#333] rounded-lg p-3 text-center">
            <FaInfoCircle className="absolute text-md text-[#a5a5a5] cursor-pointer top-3 right-3" />
            <p className="mb-2 text-sm">Engine Speed (RPM)</p>
            <div className="relative flex items-center justify-center h-32">
              <GaugeChart 
                value={metrics.rpm ?? 0} 
                minValue={0} 
                maxValue={2000} 
                majorTickInterval={600}
                minorTickInterval={100}
              />
            </div>
            <p className="w-[49%] px-2 py-0.5 mt-2 text-center text-md font-semibold text-black bg-white rounded ml-14" style={{ fontFamily: "Digital-7" }}>{(metrics.rpm ?? 0).toFixed(0)}</p>
          </div>

          {/* Load */}
          <div className="relative bg-[#333] rounded-lg p-3 text-center">
            <FaInfoCircle className="absolute text-md text-[#a5a5a5] cursor-pointer top-3 right-3" />
            <p className="mb-2 text-sm">Load (%)</p>
            <div className="relative flex items-center justify-center h-32">
              <GaugeChart 
                value={metrics.load ?? 0} 
                minValue={0} 
                maxValue={80} 
                majorTickInterval={20}
                minorTickInterval={5}
              />
            </div>
            <p className="w-[49%] px-2 py-0.5 mt-2 text-center text-md font-semibold text-black bg-white rounded ml-14" style={{ fontFamily: "Digital-7" }}>{(metrics.load ?? 0).toFixed(1)} </p>
          </div>

          {/* Battery Voltage & Power Factor */}
          <div className="bg-[#333] rounded-lg p-4 text-center flex space-x-0">
            {/* Battery Voltage Section */}
            <div className="flex-1">
              <p className="text-sm text-white mb-7">Battery Voltage</p>
              <div className="relative flex items-center justify-center h-20 mb-2">
                {!batteryLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#333] rounded">
                    <Loader />
                  </div>
                )}
                <Image
                  src="/battery.png"
                  alt="Battery"
                  width={30}
                  height={10}
                  className="object-contain w-full h-auto max-w-[55px]"
                  style={{ opacity: batteryLoaded ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}
                  onLoadingComplete={() => setBatteryLoaded(true)}
                  loading="lazy" 
                />
              </div>
              <p className={`mt-5 text-xl font-semibold text-white ${karla.className}`}>{(metrics.batteryVoltage ?? 0).toFixed(1)} V</p>
            </div>

            {/* Power Factor Section */}
            <div className="flex-1">
              <p className="text-sm text-white mb-7">Power Factor</p>
              <div className="relative flex items-center justify-center h-20 mb-5">
                {!pfLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#333] rounded">
                    <Loader />
                  </div>
                )}
                <Image
                  src="/pf.png"
                  alt="Power Factor"
                  width={130}
                  height={50}
                  className="object-contain w-full h-auto max-w-[80px]"
                  style={{ opacity: pfLoaded ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}
                  onLoadingComplete={() => setPfLoaded(true)}
                  loading="lazy"
                />
              </div>
              <p className={`text-xl font-semibold text-white ${karla.className}`}>
                {(metrics.powerFactor ?? 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Total Hours */}
          <div className="bg-[#333] rounded-lg p-3 text-center">
            <p className="mt-2.5 mb-2 text-sm text-gray-300">Total Hours</p>
            <div className="py-0 font-mono text-[31px] tracking-widest text-black bg-white rounded-sm w-[170px] mx-auto overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontFamily: "Digital-7" }}>
              9000  :  15
            </div>
            <p className="mt-3 text-sm text-gray-300">Fuel Consumed</p>
            <div className="py-0 font-mono text-[31px] tracking-widest text-black bg-white rounded-sm w-[170px] mx-auto overflow-hidden text-ellipsis whitespace-nowrap mt-2" style={{ fontFamily: "Digital-7" }}>
              {(metrics.fuelConsumed ?? 0).toFixed(2)} L
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section - Generator Performance Details */}
      <div className="mt-4">
        <h3 className="mb-3 text-xl font-semibold">Generator Performance Details</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
          <GeneralOperator
            title="Electrical Stability"
            chartId="electrical-stability"
            seriesConfig={electricalStabilityConfig}
            apiUrl={`${baseApiUrl}/electrical-stability`}
            queryParams={chartQueryParams}
            yAxisTitleLeft="Voltage (V)"
            yAxisTitleRight="Frequency (Hz)"
            showMarkers={true}
            extraPayload={extraPayload}
          />
          <GeneralOperator
            title="Load Sharing Across Phases"
            chartId="load-sharing"
            seriesConfig={loadSharingConfig}
            apiUrl={`${baseApiUrl}/load-sharing`}
            queryParams={chartQueryParams}
            yAxisTitleLeft="Load (%)"
            showMarkers={true}
            extraPayload={extraPayload}
          />
          <GeneralOperator
            title="Current Balance and Neutral Loading"
            chartId="current-balance"
            seriesConfig={currentBalanceConfig}
            apiUrl={`${baseApiUrl}/current-balance`}
            queryParams={chartQueryParams}
            yAxisTitleLeft="Current Imbalance(%)"
            yAxisTitleRight="Neutral Current"
            extraPayload={extraPayload}
          />
          <GeneralOperator
            title="Engine Thermal Performance"
            chartId="engine-thermal"
            seriesConfig={engineThermalConfig}
            apiUrl={`${baseApiUrl}/engine-thermal`}
            queryParams={chartQueryParams}
            yAxisTitleLeft="Coolent Temperature"
            yAxisTitleRight="Oil Temperature"
            extraPayload={extraPayload}
          />
          <GeneralOperator
            title="Lubrication System Pressure"
            chartId="lube-pressure"
            seriesConfig={lubePressureConfig}
            apiUrl={`${baseApiUrl}/lube-pressure`}
            queryParams={chartQueryParams}
            yAxisTitleLeft="Oil Pressure"
            extraPayload={extraPayload}
          />
          <GeneralOperator
            title="Fuel Demand"
            chartId="fuel-demand"
            seriesConfig={fuelDemandConfig}
            apiUrl={`${baseApiUrl}/fuel-demand`}
            queryParams={chartQueryParams}
            yAxisTitleLeft="Fuel Rate"
            extraPayload={extraPayload}
          />
        </div>
      </div>
    </div>
  );
}
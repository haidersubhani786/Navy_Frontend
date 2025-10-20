// src/config/navigation.js

// import {
//   faTachometerAlt,
//   faProjectDiagram,
//   faChartBar,
//   faArrowTrendUp,
//   faFileAlt,
//   faBell,
//   faUser,
// } from "@fortawesome/free-solid-svg-icons";

// Custom SVG icons


// ========== PRIVILEGE CONFIG ==========
export const privilegeConfig = {
  Dashboard: {
    href: "/dashboard",
    // icon: faTachometerAlt,
    label: "Dashboard",
    matchPaths: ["/dashboard", "/engineer_level"],
    tab: "Home",
  },
  Trends: {
    href: "/custom_trend",
    // icon: faArrowTrendUp,
    label: "Trends",
    matchPaths: ["/custom_trend", "/comparison_trends"],
    tab: "Trends",
  },
  Alarms: {
    href: "/alarm_type_config",
    // icon: faBell,
    label: "Alarms",
    tab: "Alarms",
    matchPaths: [
      "/alarm_config",
      "/alarm_type_config",
      "/alarm_config_type",
      "/alarms",
      "/alarm",
      "/alarm_details",
    ],
  },
  "AI Analysis": {
    href: "/ai",
    // icon: faChartBar,
    label: "AI Analysis",
    matchPaths: ["/ai"],
    tab: "AI",
  },
  Reports: {
    href: "/cooling_tower_report?type=Process&meterId=CT1",
    // icon: faFileAlt,
    label: "Reports",
    tab: "Reports",
    matchPaths: ["/cooling_tower_report", "/CoolingTowerReportTable"],
  },
  "User Management": {
    href: "/user_management",
    // icon: faUser,
    label: "User Management",
    tab: "User Management",
    matchPaths: ["/user_management"],
  },
};

// ========== ORDER OF TABS ==========
export const privilegeOrder = [
  "Dashboard",
  "Trends",
  "Alarms",
  "AI Analysis",
  "Reports",
  "User Management",
  
];

// ========== SIDEBAR LINKS (optional future use) ==========
// export const sidebarLinksMap = {
//   Home: [
//     {
//       id: 0,
//       title: "Plant Energy",
//     //   icon: PowerIcon,
//       submenu: [
//         // { id: 1, title: "Process/Chiller", href: "/process_chillar", icon: PlantOverview },
//         // { id: 3, title: "Differentials", href: "/differentials", icon: PlantOverview },
//       ],
//     },
//   ],
//   Analysis: [
//     {
//       id: 0,
//       title: "Cooling Tower Parameters",
//     //   icon: PowerIcon,
//       submenu: [
//         // { id: 0, title: "Efficiency & Effectiveness", href: "/analysis", icon: PlantOverview },
//         // { id: 1, title: "Water Loss Monitoring", href: "/water_loss-monitoring", icon: PlantOverview },
//         // { id: 3, title: "Real-Time Monitoring", href: "/rt_monitoring", icon: PlantOverview },
//       ],
//     },
//   ],
//   Diagram: [
//     {
//       id: 0,
//       title: "P&ID",
//     //   icon: CoolingTowerIcon,
//       submenu: [
//         // { id: 0, title: "Chiller Cooling Tower", href: "/diagram_sld?type=Chillers", icon: ListIcon },
//         // { id: 1, title: "Process Cooling Tower", href: "/diagram_sld?type=Processor", icon: ListIcon },
//       ],
//     },
//   ],
//   Alarms: [
//     {
//       id: 0,
//       title: "Alarm Setup",
//     //   icon: AlarmBellIcon,
//       matchPaths: [
//         "/alarm_config",
//         "/alarm_type_config",
//         "/alarm_config_type",
//         "/alarms",
//       ],
//       submenu: [
//         // { id: 0, title: "Alarm Config.", href: "/alarm_type_config", icon: AlarmSubMenuIcon },
//       ],
//     },
//   ],
//   Reports: [
//     {
//       id: 0,
//       title: "Process Cooling Tower",
//     //   icon: CoolingTowerIcon,
//       submenu: [
//         // { id: 0, title: "4101-E05", href: "/cooling_tower_report?type=Process&meterId=CT1", icon: ListIcon },
//         // { id: 1, title: "4101-E06", href: "/cooling_tower_report?type=Process&meterId=CT2", icon: ListIcon },
//       ],
//     },
//   ],
// };

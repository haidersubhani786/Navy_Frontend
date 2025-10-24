// "use client";
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import * as am4core from "@amcharts/amcharts4/core";
// import * as am4charts from "@amcharts/amcharts4/charts";
// import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";
// import { HiMiniChevronDown } from "react-icons/hi2";
// import { IoChevronUp } from "react-icons/io5";
// import { FaCalendarAlt, FaFilePdf, FaFileExcel, FaImage } from "react-icons/fa";
// // import ExcelJS from "exceljs";
// import Image from "next/image";
// import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
// // import { saveAs } from "file-saver";
// // import Swal from "sweetalert2";
// import { useTheme } from "next-themes";
// import Switch from "react-switch";
// import config from "../../../../config";

// let __AMCHARTS_THEMES_SET__ = false;
// if (!__AMCHARTS_THEMES_SET__) {
//   am4core.useTheme(am4themes_kelly);
//   am4core.useTheme(am4themes_animated);
//   __AMCHARTS_THEMES_SET__ = true;
// }

// // -------- helpers --------
// async function loadImageAsBase64(path) {
//   try {
//     const res = await fetch(path, { cache: "no-cache" });
//     if (!res.ok) return "";
//     const blob = await res.blob();
//     return await new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result);
//       reader.onerror = reject;
//       reader.readAsDataURL(blob);
//     });
//   } catch (e) {
//     console.error("Failed to load image", path, e);
//     return "";
//   }
// }
// const formatTime = (d) => new Date(d).toTimeString().slice(0, 8);

// if (pdfFonts?.pdfMake?.vfs) {
//   pdfMake.vfs = pdfFonts.pdfMake.vfs;
// }

// function getDisplayName(key) {
//   if (!key) return "";
//   return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
// }

// function getUnit(key) {
//   if (!key) return "";
//   const lowerKey = key.toLowerCase();
//   if (lowerKey.includes("kw")) return "kW";
//   if (lowerKey.includes("kva")) return "kVA";
//   if (lowerKey.includes("current") || lowerKey.includes("amp")) return "A";
//   if (lowerKey.includes("voltage") || lowerKey.includes("v")) return "V";
//   if (lowerKey.includes("hz") || lowerKey.includes("frequency")) return "Hz";
//   if (lowerKey.includes("pressure")) return "bar";
//   if (lowerKey.includes("temperature")) return "°C";
//   if (lowerKey.includes("time")) return "h";
//   if (lowerKey.includes("percent") || lowerKey.includes("%")) return "%";
//   return "";
// }

// function CustomTrend() {
//   // -------- state --------
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const startDateRef = useRef(null);
//   const endDateRef = useRef(null);

//   const [loading, setLoading] = useState(false);
//   const chartElRef = useRef(null);
//   const chartRef = useRef(null);

//   const [selectedMeter, setSelectedMeter] = useState([]);
//   const [selectedParameter, setSelectedParameter] = useState([]);
//   const [chartData, setChartData] = useState([]);
//   const [showMeters, setShowMeters] = useState(false);
//   const [showParameters, setShowParameters] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [unitForExportFile, setUnitForExportFile] = useState("");
//   const [showPdfBtn, setShowPdfBtn] = useState(false);
//   const [metersFromAPI, setMetersFromAPI] = useState([]);
//   const [showImageMenu, setShowImageMenu] = useState(false);
//   const [isRange, setIsRange] = useState(true);

//   const { theme } = useTheme();

//   // -------- derived --------
//   const isReady =
//     !!startDate &&
//     !!endDate &&
//     (selectedMeter.length > 0 || selectedParameter.length > 0);

//   const seriesKeys = useMemo(
//     () => [...selectedMeter, ...selectedParameter].filter(Boolean),
//     [selectedMeter, selectedParameter]
//   );

//   const parameters = useMemo(() => metersFromAPI, [metersFromAPI]);

//   const selectedMeterNames = useMemo(
//     () => selectedMeter.map(getDisplayName).join(", "),
//     [selectedMeter]
//   );
//   const selectedParameterNames = useMemo(
//     () => selectedParameter.map(getDisplayName).join(", "),
//     [selectedParameter]
//   );

//   // -------- effects: dropdown outside click --------
//   const meterDropdownRef = useRef(null);
//   const parameterDropdownRef = useRef(null);
//   useEffect(() => {
//     function handleClickOutside(e) {
//       const t = e.target;
//       if (meterDropdownRef.current && !meterDropdownRef.current.contains(t))
//         setShowMeters(false);
//       if (
//         parameterDropdownRef.current &&
//         !parameterDropdownRef.current.contains(t)
//       )
//         setShowParameters(false);
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // -------- effects: enforce end date min = start+1 --------
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

//   // -------- effects: theme / dark mode detection --------
//   useEffect(() => {
//     const handleThemeChange = () => {
//       setIsDarkMode(document.documentElement.classList.contains("dark"));
//     };
//     handleThemeChange();
//     const mm = window.matchMedia("(prefers-color-scheme: dark)");
//     mm.addEventListener("change", handleThemeChange);
//     return () => {
//       mm.removeEventListener("change", handleThemeChange);
//     };
//   }, []);

//   useEffect(() => {
//     fetch(`${config.BASE_URL}/trends/getlist`)
//       .then((res) => res.json())
//       .then((data) => {
//         const uniqueData = [...new Set(data)];
//         setMetersFromAPI(uniqueData);
//       })
//       .catch((err) => console.error("Error fetching meters:", err));
//   }, []);

//   useEffect(() => {
//     if (seriesKeys.length === 0 || !startDate || !endDate) {
//       setChartData([]);
//       setShowPdfBtn(false);
//       return;
//     }

//     setLoading(true);

//     const payload = {
//       mode: isRange ? "range" : "historic",
//       startDate: `${startDate}T00:00:00.000Z`,
//       endDate: `${endDate}T00:00:00.000Z`,
//       params: seriesKeys,
//     };

//     fetch(`${config.BASE_URL}/trends`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         const formatted = data.map((row) => {
//           const dateObj = new Date(row.timestamp);
//           const formattedRow = { Date: dateObj };
//           Object.keys(row).forEach((key) => {
//             if (key !== "timestamp") formattedRow[key] = row[key];
//           });
//           return formattedRow;
//         });
//         setChartData(formatted);
//         setShowPdfBtn(formatted.length > 0);
//       })
//       .catch((err) => {
//         console.error("Error fetching trend data:", err);
//         setChartData([]);
//         setShowPdfBtn(false);
//       })
//       .finally(() => setLoading(false));
//   }, [startDate, endDate, seriesKeys, isRange]);

//   const displaySeriesKeys = useMemo(
//     () => seriesKeys.map(getDisplayName),
//     [seriesKeys]
//   );

//   useEffect(() => {
//     if (chartRef.current) {
//       try {
//         chartRef.current.dispose();
//       } catch {}
//       chartRef.current = null;
//     }
//     if (!chartElRef.current) return;

//     const chart = am4core.create(chartElRef.current, am4charts.XYChart);
//     chart.logo.disabled = true;
//     chart.cursor = new am4charts.XYCursor();
//     chart.mouseWheelBehavior = "zoomX";
//     chart.legend = new am4charts.Legend();
//     chart.legend.position = "bottom";
//     chart.data = [];

//     chartRef.current = chart;

//     const isDark = isDarkMode;
//     const textColor = isDark ? "#fff" : "#000";

//     // X axis
//     const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
//     dateAxis.dateFormatter.utc = true;
//     dateAxis.renderer.labels.template.fontSize = 12;
//     dateAxis.renderer.labels.template.fill = am4core.color(textColor);
//     dateAxis.renderer.grid.template.stroke = am4core.color("#ccc");
//     dateAxis.renderer.grid.template.strokeOpacity = 0.6;
//     dateAxis.renderer.grid.template.strokeDasharray = "3,3";

//     dateAxis.baseInterval = { timeUnit: "second", count: 3 };

//     // Left Y axis (Primary)
//     const valueAxisLeft = chart.yAxes.push(new am4charts.ValueAxis());
//     const primaryKey = selectedMeter.length > 0 ? selectedMeter[0] : "";
//     const primaryDisplayName = getDisplayName(primaryKey);
//     const primaryUnit = getUnit(primaryKey);
//     const primaryTitle = primaryUnit
//       ? `${primaryDisplayName} (${primaryUnit})`
//       : primaryDisplayName;

//     valueAxisLeft.title.text = primaryTitle || "";
//     valueAxisLeft.title.fill = am4core.color(textColor);
//     valueAxisLeft.title.fontSize = 12;
//     valueAxisLeft.renderer.labels.template.fontSize = 12;
//     valueAxisLeft.renderer.labels.template.fill = am4core.color(textColor);
//     valueAxisLeft.renderer.grid.template.stroke = am4core.color("#ccc");
//     valueAxisLeft.renderer.grid.template.strokeOpacity = 0.6;
//     valueAxisLeft.renderer.grid.template.strokeDasharray = "3,3";

//     // Right Y axis (Secondary) - only if secondary parameters selected
//     let valueAxisRight = null;
//     if (selectedParameter.length > 0) {
//       valueAxisRight = chart.yAxes.push(new am4charts.ValueAxis());
//       valueAxisRight.renderer.opposite = true;
//       const secondaryKey = selectedParameter[0];
//       const secondaryDisplayName = getDisplayName(secondaryKey);
//       const secondaryUnit = getUnit(secondaryKey);
//       const secondaryTitle = secondaryUnit
//         ? `${secondaryDisplayName} (${secondaryUnit})`
//         : secondaryDisplayName;
//       valueAxisRight.title.text = secondaryTitle || "";
//       valueAxisRight.title.fill = am4core.color(textColor);
//       valueAxisRight.title.fontSize = 12;
//       valueAxisRight.renderer.labels.template.fontSize = 12;
//       valueAxisRight.renderer.labels.template.fill = am4core.color(textColor);
//       valueAxisRight.renderer.grid.template.stroke = am4core.color("#ccc");
//       valueAxisRight.renderer.grid.template.strokeOpacity = 0.6;
//       valueAxisRight.renderer.grid.template.strokeDasharray = "3,3";
//     }

//     // Set unit for export based on primary or first available
//     const exportKey =
//       selectedMeter.length > 0
//         ? selectedMeter[0]
//         : selectedParameter.length > 0
//         ? selectedParameter[0]
//         : "";
//     const exportDisplayName = getDisplayName(exportKey);
//     const exportUnit = getUnit(exportKey);
//     setUnitForExportFile(
//       exportUnit ? `${exportDisplayName} (${exportUnit})` : exportDisplayName
//     );

//     chart.legend.labels.template.fill = am4core.color(textColor);
//     chart.legend.labels.template.fontSize = 12;

//     const colorList = [
//       "#FF9933",
//       "#A569BD",
//       "#F7DC6F",
//       "#8BC63E",
//       "#E74C3C",
//       "#3498DB",
//       "#BDC3C7",
//       "#000FE6",
//       "#680056",
//       "#1A5276",
//     ];

//     seriesKeys.forEach((keyName, i) => {
//       const series = chart.series.push(new am4charts.LineSeries());
//       series.dataFields.dateX = "Date";
//       series.dataFields.valueY = keyName;
//       series.name = getDisplayName(keyName);
//       series.stroke = am4core.color(colorList[i % colorList.length]);
//       series.strokeWidth = 2;
//       series.tooltipText = "{name}: [b]{valueY.formatNumber('#.##')}[/]";

//       // Assign to appropriate Y axis
//       const isSecondary = selectedParameter.includes(keyName);
//       if (isSecondary && valueAxisRight) {
//         series.yAxis = valueAxisRight;
//       } else {
//         series.yAxis = valueAxisLeft;
//       }
//     });

//     // Horizontal Scrollbar Removed

//     // if (!chart.scrollbarX) chart.scrollbarX = new am4charts.XYChartScrollbar();
//     // const sb = chart.scrollbarX;
//     // const gripColor = am4core.color(isDark ? "#cbd5e1" : "#9ca3af");

//     // if (chart.series.length > 0 && sb.series.length === 0) {
//     //   const src = chart.series.getIndex(0);
//     //   const preview = sb.series.push(new am4charts.LineSeries());
//     //   preview.dataFields.dateX = src.dataFields.dateX;
//     //   preview.dataFields.valueY = src.dataFields.valueY;
//     //   preview.strokeOpacity = 0.55;
//     //   preview.stroke = am4core.color("#94a3b8");
//     //   preview.fillOpacity = 0.08;
//     // }

//     // sb.height = 16;
//     // sb.minHeight = 16;
//     // sb.padding(0, 0, 0, 0);
//     // sb.marginBottom = 0;
//     // sb.background.fill = am4core.color(isDark ? "#334155" : "#e9ecef");
//     // sb.background.fillOpacity = 1;
//     // sb.background.stroke = am4core.color(isDark ? "#475569" : "#d1d5db");
//     // sb.background.strokeOpacity = 1;
//     // sb.background.cornerRadius(8, 8, 8, 8);
//     // sb.unselectedOverlay.fill = am4core.color(isDark ? "#0b1220" : "#000000");
//     // sb.unselectedOverlay.fillOpacity = isDark ? 0.12 : 0.06;
//     // sb.unselectedOverlay.strokeOpacity = 0;
//     // sb.thumb.minWidth = 48;
//     // sb.thumb.background.fill = am4core.color(isDark ? "#475569" : "#ede6e6ff");
//     // sb.thumb.background.fillOpacity = 0.9;
//     // sb.thumb.background.stroke = am4core.color(isDark ? "#64748b" : "#cbd5e1");
//     // sb.thumb.background.strokeOpacity = 1;
//     // sb.thumb.background.strokeWidth = 1;

//     // function applyChevronGrip(grip) {
//     //   if (grip.icon) grip.icon.disabled = true;
//     //   if (grip.background) {
//     //     grip.background.fillOpacity = 0;
//     //     grip.background.strokeOpacity = 0;
//     //     grip.background.cornerRadius(0, 0, 0, 0);
//     //   }
//     //   const c = grip.createChild(am4core.Container);
//     //   c.width = 12;
//     //   c.height = 16;
//     //   c.horizontalCenter = "middle";
//     //   c.verticalCenter = "middle";
//     //   c.align = "center";
//     //   c.valign = "middle";

//     //   const line = c.createChild(am4core.Line);
//     //   line.x1 = 6;
//     //   line.x2 = 6;
//     //   line.y1 = 2;
//     //   line.y2 = 14;
//     //   line.stroke = gripColor;
//     //   line.strokeWidth = 1.5;
//     //   line.pixelPerfect = true;

//     //   const up = c.createChild(am4core.Triangle);
//     //   up.width = 6;
//     //   up.height = 4;
//     //   up.fill = gripColor;
//     //   up.strokeOpacity = 0;
//     //   up.x = 6;
//     //   up.y = 4;
//     //   up.horizontalCenter = "middle";
//     //   up.verticalCenter = "middle";

//     //   const down = c.createChild(am4core.Triangle);
//     //   down.width = 6;
//     //   down.height = 4;
//     //   down.fill = gripColor;
//     //   down.strokeOpacity = 0;
//     //   down.rotation = 180;
//     //   down.x = 6;
//     //   down.y = 12;
//     //   down.horizontalCenter = "middle";
//     //   down.verticalCenter = "middle";

//     //   const s = grip.states.create("hover");
//     //   s.properties.scale = 1.08;
//     // }
//     // applyChevronGrip(sb.startGrip);
//     // applyChevronGrip(sb.endGrip);

//     return () => {
//       try {
//         chart.dispose();
//       } catch {}
//       chartRef.current = null;
//     };
//   }, [seriesKeys, selectedMeter, selectedParameter, isDarkMode]);

//   useEffect(() => {
//     if (chartRef.current) {
//       chartRef.current.data = chartData || [];
//     }
//   }, [chartData]);

//   useEffect(() => {
//     const chart = chartRef.current;
//     if (!chart) return;

//     const textColor = isDarkMode ? "#fff" : "#000";

//     chart.legend.labels.template.fill = am4core.color(textColor);

//     chart.yAxes.values.forEach((axis) => {
//       axis.renderer.labels.template.fill = am4core.color(textColor);
//       axis.title.fill = am4core.color(textColor);
//     });
//     chart.xAxes.values.forEach((axis) => {
//       axis.renderer.labels.template.fill = am4core.color(textColor);
//     });

//     if (chart.scrollbarX) {
//       const sb = chart.scrollbarX;
//       sb.background.fill = am4core.color(isDarkMode ? "#334155" : "#e9ecef");
//       sb.background.stroke = am4core.color(isDarkMode ? "#475569" : "#d1d5db");
//       sb.unselectedOverlay.fill = am4core.color(
//         isDarkMode ? "#0b1220" : "#000000"
//       );
//       sb.unselectedOverlay.fillOpacity = isDarkMode ? 0.12 : 0.06;
//     }
//   }, [isDarkMode]);

//   const exportChartImage = (type) => {
//     if (!chartRef.current) return;
//     chartRef.current.exporting.filePrefix = "Customized_Trends";
//     chartRef.current.exporting.export(type);
//     setShowImageMenu(false);
//   };

//   const exportToExcel = async () => {
//     if (chartData.length === 0) {
//       alert("No data to export!");
//       return;
//     }

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet("Trend Data");

//     const rows = chartData.map((row) => {
//       const d = new Date(row.Date);
//       const obj = {
//         Date: d.toLocaleDateString(),
//         Time: formatTime(d),
//       };
//       seriesKeys.forEach((k, i) => {
//         const v = row?.[k];
//         obj[displaySeriesKeys[i]] = Number.isFinite(v)
//           ? +Number(v).toFixed(2)
//           : v ?? "";
//       });
//       return obj;
//     });

//     const columns = ["Date", "Time", ...displaySeriesKeys];

//     worksheet.getRow(1).height = 30;
//     worksheet.getRow(2).height = 30;
//     worksheet.getRow(3).height = 30;

//     worksheet.mergeCells(1, 1, 1, columns.length);
//     const t1 = worksheet.getCell(1, 1);
//     t1.value = `Trend Data: ${unitForExportFile || "—"}`;
//     t1.font = { bold: true, size: 16, color: { argb: "FF1D5999" } };
//     t1.alignment = { horizontal: "center", vertical: "middle" };
//     t1.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "cedef0" },
//     };

//     worksheet.mergeCells(2, 1, 2, columns.length);
//     const t2 = worksheet.getCell(2, 1);
//     t2.value = `Period: ${startDate || "—"} to ${endDate || "—"}`;
//     t2.font = { bold: true, size: 16, color: { argb: "FF1D5999" } };
//     t2.alignment = { horizontal: "center", vertical: "middle" };
//     t2.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "cedef0" },
//     };

//     const headerRow = worksheet.getRow(3);
//     headerRow.values = columns;
//     headerRow.eachCell((cell) => {
//       cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
//       cell.alignment = { horizontal: "center", vertical: "middle" };
//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "FF1D5999" },
//       };
//       cell.border = {
//         top: { style: "thin", color: { argb: "cedef0" } },
//         bottom: { style: "thin", color: { argb: "cedef0" } },
//         left: { style: "thin", color: { argb: "cedef0" } },
//         right: { style: "thin", color: { argb: "cedef0" } },
//       };
//     });

//     rows.forEach((r) => worksheet.addRow(columns.map((c) => r[c])));
//     worksheet.columns = columns.map(() => ({ width: 20 }));

//     const buffer = await workbook.xlsx.writeBuffer();
//     const blob = new Blob([buffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });
//     const safe = (s) =>
//       String(s)
//         .replace(/\s+/g, "_")
//         .replace(/[:/\\]/g, "-");
//     console.log(
//       "Export to Excel would save:",
//       `trend_data_${safe(unitForExportFile || "param")}_${safe(
//         startDate || "NA"
//       )}_to_${safe(endDate || "NA")}.xlsx`
//     );
//   };

//   const exportToPDF = async () => {
//     if (chartData.length === 0) {
//       alert("No data to export!");
//       return;
//     }

//     const headers = ["Date", "Time", ...displaySeriesKeys];
//     const bodyRows = chartData.map((row) => {
//       const d = new Date(row.Date);
//       return [
//         d.toLocaleDateString(),
//         formatTime(d),
//         ...seriesKeys.map((k) => {
//           const v = row?.[k];
//           return Number.isFinite(v) ? +Number(v).toFixed(2) : v ?? "";
//         }),
//       ];
//     });

//     const surajCottonBase64Logo = await loadImageAsBase64("/ifl-report.png");
//     const jahaannBase64Logo = await loadImageAsBase64("/jahaann-light.png");

//     const headerColumns = [];
//     if (surajCottonBase64Logo)
//       headerColumns.push({
//         image: "surajcottonLogo",
//         width: 100,
//         alignment: "left",
//       });
//     headerColumns.push({ text: "", width: "*" });
//     if (jahaannBase64Logo)
//       headerColumns.push({
//         image: "jahaannLogo",
//         width: 100,
//         alignment: "right",
//       });

//     const docDefinition = {
//       pageOrientation: "landscape",
//       content: [
//         headerColumns.length
//           ? { columns: headerColumns, margin: [0, 0, 0, 10] }
//           : { text: "" },
//         {
//           columns: [
//             {
//               text: `Trend Data: ${unitForExportFile || "—"}`,
//               style: "header",
//               alignment: "left",
//             },
//             {
//               text: `Time-Period: ${startDate || "—"} to ${endDate || "—"}`,
//               style: "subheader",
//               alignment: "right",
//             },
//           ],
//           margin: [0, 0, 0, 20],
//         },
//         {
//           table: {
//             headerRows: 1,
//             widths: Array(headers.length).fill("*"),
//             body: [
//               headers.map((h) => ({ text: h, style: "tableHeader" })),
//               ...bodyRows,
//             ],
//           },
//           layout: {
//             fillColor: (rowIndex) => (rowIndex === 0 ? "#1D5999" : null),
//             hLineColor: () => "#cedef0",
//             vLineColor: () => "#cedef0",
//             paddingLeft: () => 5,
//             paddingRight: () => 5,
//             paddingTop: () => 3,
//             paddingBottom: () => 3,
//           },
//         },
//       ],
//       styles: {
//         header: { fontSize: 16, bold: true, color: "#1D5999" },
//         subheader: { fontSize: 12, bold: true, color: "#1D5999" },
//         tableHeader: {
//           bold: true,
//           color: "white",
//           fillColor: "#1D5999",
//           alignment: "center",
//         },
//       },
//       defaultStyle: { fontSize: 10, alignment: "center" },
//       images: {
//         ...(surajCottonBase64Logo
//           ? { surajcottonLogo: surajCottonBase64Logo }
//           : {}),
//         ...(jahaannBase64Logo ? { jahaannLogo: jahaannBase64Logo } : {}),
//       },
//     };

//     pdfMake
//       .createPdf(docDefinition)
//       .download(
//         `trend_data_${(unitForExportFile || "param").replace(/\s+/g, "_")}_${
//           startDate || "NA"
//         }_to_${endDate || "NA"}.pdf`
//       );
//   };

//   // -------- styles --------
//   const dropdownBtn =
//     "text-[12.5px] leading-[1.5rem] w-full p-[8px] border rounded-md text-left cursor-pointer bg-white dark:bg-[#2a2a2a] dark:border-gray-600 border-gray-300 hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200 shadow-sm";
//   const dropdownMenu =
//     "custom-scrollbar text-[12px] absolute bg-white border shadow-lg z-10 w-full max-h-48 overflow-y-auto rounded-md dark:bg-[#2a2a2a] dark:border-gray-600 border-gray-300";
//   const dropdownLabel =
//     "text-sm font-medium text-gray-700 dark:text-[#f5c518] block mb-1.5";
//   const isDark = theme === "dark";

//   const handleMeterChange = (val, checked) => {
//     setSelectedMeter((prev) =>
//       checked ? [...prev, val] : prev.filter((item) => item !== val)
//     );
//   };

//   const handleParameterChange = (val, checked) => {
//     setSelectedParameter((prev) =>
//       checked ? [...prev, val] : prev.filter((item) => item !== val)
//     );
//   };

//   return (
//     <div className="w-full p-4 h-[91vh] bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 overflow-hidden custom-scrollbar">
//       <div className="relative z-10 flex flex-col h-full">
//         <div className="flex items-center justify-between mb-5">
//           <h1 className="text-2xl Raleway text-[#626469] dark:text-white font-semibold">
//             Customized Trend
//           </h1>
//           <label className="flex items-center gap-2 cursor-pointer">
//             <span className="text-sm font-medium text-gray-700 dark:text-white">
//               Range
//             </span>
//             {/* <Switch
//               onChange={setIsRange}
//               checked={isRange}
//               className="react-switch"
//               onColor="#ffffff"
//               offColor="#6B7280"
//               onHandleColor="#000000"
//               offHandleColor="#ffffff"
//               handleDiameter={20}
//               uncheckedIcon={false}
//               checkedIcon={false}
//               boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
//               activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
//               height={27}
//               width={50}
//             /> */}
//             <Switch
//               onChange={setIsRange}
//               checked={isRange}
//               className="react-switch"
//               onColor={isDark ? "#ffffff" : "#000000"}
//               offColor={isDark ? "#6B7280" : "#E5E7EB"}
//               onHandleColor={isDark ? "#000000" : "#ffffff"}
//               offHandleColor={isDark ? "#ffffff" : "#000000"}
//               handleDiameter={20}
//               uncheckedIcon={false}
//               checkedIcon={false}
//               boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
//               activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
//               height={27}
//               width={50}
//             />
//           </label>
//         </div>

//         <div className="flex flex-col w-full gap-4 mb-4 md:grid md:grid-cols-4 md:gap-4">
//           {/* Start Date */}
//           <div className="w-full">
//             <label className={dropdownLabel}>Start Date</label>
//             <div className="relative w-full">
//               <input
//                 ref={startDateRef}
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 className="w-full px-3 py-2.5 pr-10 text-sm border-2 border-gray-300 rounded-md dark:bg-[#2a2a2a] dark:border-gray-700 dark:text-white focus:border-yellow-500 dark:focus:border-yellow-300 focus:outline-none transition-colors duration-200 hide-calendar-icon"
//               />
//               <FaCalendarAlt
//                 className="absolute text-gray-500 transition-colors duration-200 -translate-y-1/2 cursor-pointer right-3 top-1/2 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400"
//                 onClick={() => startDateRef.current?.showPicker()}
//               />
//             </div>
//           </div>

//           {/* End Date */}
//           <div className="w-full">
//             <label className={dropdownLabel}>End Date</label>
//             <div className="relative w-full">
//               <input
//                 ref={endDateRef}
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 className="w-full px-3 py-2.5 pr-10 text-sm border-2 border-gray-300 rounded-md dark:bg-[#2a2a2a] dark:border-gray-700 dark:text-white focus:border-yellow-500 dark:focus:border-yellow-300 focus:outline-none transition-colors duration-200 hide-calendar-icon"
//               />
//               <FaCalendarAlt
//                 className="absolute text-gray-500 transition-colors duration-200 -translate-y-1/2 cursor-pointer right-3 top-1/2 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400"
//                 onClick={() => endDateRef.current?.showPicker()}
//               />
//             </div>
//           </div>

//           {/* Primary Axis */}
//           <div ref={meterDropdownRef} className="relative w-full">
//             <label className={dropdownLabel}>Primary Axis</label>
//             <button
//               onClick={() => setShowMeters(!showMeters)}
//               className={`${dropdownBtn} flex items-center justify-between`}
//             >
//               <span className="truncate max-w-[85%]">
//                 {selectedMeter.length
//                   ? selectedMeterNames
//                   : "Select Primary Axis"}
//               </span>
//               <span className="flex-shrink-0 ml-2">
//                 {showMeters ? (
//                   <IoChevronUp size={20} />
//                 ) : (
//                   <HiMiniChevronDown size={25} />
//                 )}
//               </span>
//             </button>
//             {showMeters && (
//               <div className={dropdownMenu}>
//                 {metersFromAPI.map((m, index) => (
//                   <label
//                     key={`${m}-${index}`}
//                     title={m}
//                     className="flex items-center px-4 py-2.5 truncate dark:hover:bg-gray-600 hover:bg-gray-50 dark:bg-[#2a2a2a] cursor-pointer transition-colors duration-150"
//                   >
//                     <input
//                       type="checkbox"
//                       value={m}
//                       checked={selectedMeter.includes(m)}
//                       onChange={(e) => handleMeterChange(m, e.target.checked)}
//                       className="mr-3 accent-[#f5c518] rounded"
//                     />
//                     <span className="max-w-[80%] truncate text-sm">
//                       {getDisplayName(m)}
//                     </span>
//                   </label>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Secondary Axis */}
//           <div ref={parameterDropdownRef} className="relative w-full">
//             <label className={dropdownLabel}>Secondary Axis</label>
//             <button
//               onClick={() => setShowParameters(!showParameters)}
//               className={`${dropdownBtn} flex items-center justify-between`}
//             >
//               <span className="truncate max-w-[85%]">
//                 {selectedParameter.length
//                   ? selectedParameterNames
//                   : "Select Secondary Axis"}
//               </span>

//               <span className="flex-shrink-0 ml-2">
//                 {showParameters ? (
//                   <IoChevronUp size={20} />
//                 ) : (
//                   <HiMiniChevronDown size={25} />
//                 )}
//               </span>
//             </button>

//             {showParameters && (
//               <div className={dropdownMenu}>
//                 {parameters.map((param, index) => (
//                   <label
//                     key={`${param}-${index}`}
//                     title={param}
//                     className="flex items-center px-4 py-2.5 truncate dark:hover:bg-gray-600 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
//                   >
//                     <input
//                       type="checkbox"
//                       value={param}
//                       checked={selectedParameter.includes(param)}
//                       onChange={(e) =>
//                         handleParameterChange(param, e.target.checked)
//                       }
//                       className="mr-3 accent-[#f5c518] rounded"
//                     />
//                     <span className="max-w-[80%] truncate text-sm">
//                       {getDisplayName(param)}
//                     </span>
//                   </label>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Chart + Export */}
//         <div className="flex-1 w-full">
//           <div className="relative">
//             <div className="flex-1 w-full">
//               {showPdfBtn && (
//                 <div className="relative flex justify-end gap-3 mb-3">
//                   {/* Images */}
//                   <div className="relative">
//                     <button
//                       onClick={() => setShowImageMenu((s) => !s)}
//                       title="Export as image"
//                       aria-label="Export as image"
//                       className="p-2.5 rounded-full bg-[#f8f9fa] hover:bg-[#e9ecef] dark:bg-gray-700 dark:hover:bg-gray-600 shadow-sm cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-gray-600"
//                     >
//                       <FaImage className="w-4 h-4 text-gray-600 dark:text-gray-300" />
//                     </button>
//                     {showImageMenu && (
//                       <div className="absolute right-0 z-30 py-1 mt-2 bg-white border rounded-lg shadow-lg w-28 dark:bg-gray-800 dark:border-gray-600">
//                         <button
//                           onClick={() => exportChartImage("png")}
//                           className="w-full px-3 py-2 text-sm text-left transition-colors duration-150 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
//                         >
//                           PNG
//                         </button>
//                         <button
//                           onClick={() => exportChartImage("jpg")}
//                           className="w-full px-3 py-2 text-sm text-left transition-colors duration-150 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
//                         >
//                           JPG
//                         </button>
//                         <button
//                           onClick={() => exportChartImage("svg")}
//                           className="w-full px-3 py-2 text-sm text-left transition-colors duration-150 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
//                         >
//                           SVG
//                         </button>
//                       </div>
//                     )}
//                   </div>

//                   {/* PDF */}
//                   <button
//                     onClick={exportToPDF}
//                     title="Export as PDF"
//                     aria-label="Export as PDF"
//                     className="p-2.5 rounded-full bg-[#f8f9fa] hover:bg-[#e9ecef] dark:bg-gray-700 dark:hover:bg-gray-600 shadow-sm cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-gray-600"
//                   >
//                     <FaFilePdf className="w-4 h-4 text-red-600 dark:text-red-400" />
//                   </button>

//                   {/* Excel */}
//                   <button
//                     onClick={exportToExcel}
//                     title="Export as Excel"
//                     aria-label="Export as Excel"
//                     className="p-2.5 rounded-full bg-[#f8f9fa] hover:bg-[#e9ecef] dark:bg-gray-700 dark:hover:bg-gray-600 shadow-sm cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-gray-600"
//                   >
//                     <FaFileExcel className="w-4 h-4 text-green-600 dark:text-green-400" />
//                   </button>
//                 </div>
//               )}
//             </div>

//             <div className="relative w-full" style={{ height: "64vh" }}>
//               <div
//                 ref={chartElRef}
//                 id="chartDiv"
//                 className="w-full h-full bg-white rounded-lg dark:bg-[#2a2a2a] shadow-sm"
//               />
//               {!isReady && !loading && (
//                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 dark:bg-[#1e1e1e]/95 backdrop-blur-sm rounded-lg">
//                   <Image
//                     src="/trend_icon.svg"
//                     alt="alt-img"
//                     width={800}
//                     height={400}
//                     className="h-[40vh] w-[80vh] opacity-80"
//                   />

//                   <p className="mt-4 font-bold text-gray-600 dark:text-gray-300">
//                     Select Desired Filters to view Trend!
//                   </p>
//                 </div>
//               )}
//               {loading && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-[#2a2a2a]/90 backdrop-blur-sm rounded-lg">
//                   <div className="loader" />
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CustomTrend;


"use client";
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { HiMiniChevronDown } from "react-icons/hi2";
import { IoChevronUp } from "react-icons/io5";
import { FaCalendarAlt, FaFilePdf, FaFileExcel, FaImage } from "react-icons/fa";
// import ExcelJS from "exceljs";
import Image from "next/image";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
// import { saveAs } from "file-saver";
// import Swal from "sweetalert2";
import { useTheme } from "next-themes";
import Switch from "react-switch";
import config from "../../../../config";

let __AMCHARTS_THEMES_SET__ = false;
if (!__AMCHARTS_THEMES_SET__) {
  am4core.useTheme(am4themes_kelly);
  am4core.useTheme(am4themes_animated);
  __AMCHARTS_THEMES_SET__ = true;
}

// -------- helpers --------
async function loadImageAsBase64(path) {
  try {
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) return "";
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.error("Failed to load image", path, e);
    return "";
  }
}
const formatTime = (d) => new Date(d).toTimeString().slice(0, 8);

if (pdfFonts?.pdfMake?.vfs) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
}

function getDisplayName(key) {
  if (!key) return "";
  return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function getUnit(key) {
  if (!key) return "";
  const lowerKey = key.toLowerCase();
  if (lowerKey.includes("kw")) return "kW";
  if (lowerKey.includes("kva")) return "kVA";
  if (lowerKey.includes("current") || lowerKey.includes("amp")) return "A";
  if (lowerKey.includes("voltage") || lowerKey.includes("v")) return "V";
  if (lowerKey.includes("hz") || lowerKey.includes("frequency")) return "Hz";
  if (lowerKey.includes("pressure")) return "bar";
  if (lowerKey.includes("temperature")) return "°C";
  if (lowerKey.includes("time")) return "h";
  if (lowerKey.includes("percent") || lowerKey.includes("%")) return "%";
  return "";
}

const categorizeParameters = (params) => {
  // Manual mapping for all parameters based on API response
  const manualMapping = {
    // Current
    "Genset_L1_Current": "Current",
    "Genset_L2_Current": "Current",
    "Genset_L3_Current": "Current",
    "Genset_Avg_Current": "Current",
    "Genset_Application_Nominal_Current_PC2X": "Current",
    "Genset_Standby_Nominal_Current_PC2X": "Current",
    "Neutral_Current": "Current",
    "Current_Imbalance": "Current",

    // Voltage
    "Genset_L1L2_Voltage": "Voltage",
    "Genset_L2L3_Voltage": "Voltage",
    "Genset_L3L1_Voltage": "Voltage",
    "Genset_L1N_Voltage": "Voltage",
    "Genset_L2N_Voltage": "Voltage",
    "Genset_L3N_Voltage": "Voltage",
    "Genset_LL_Avg_Voltage": "Voltage",
    "Genset_LN_Avg_Voltage": "Voltage",
    "Nominal_Battery_Voltage": "Voltage",
    "Battery_Voltage_calculated": "Voltage",
    "Voltage_Imbalance": "Voltage",

    // Temperature
    "Oil_Temperature": "Temperature",
    "Coolant_Temperature": "Temperature",
    "Intake_Manifold_Temperature_calculated": "Temperature",

    // Power
    "Genset_L1_kW": "Power",
    "Genset_L2_kW": "Power",
    "Genset_L3_kW": "Power",
    "Genset_Total_kW": "Power",
    "Genset_L1_kVA": "Power",
    "Genset_L2_kVA": "Power",
    "Genset_L3_kVA": "Power",
    "Genset_Total_kVA": "Power",
    "Genset_L1_Power_Factor_PC2X": "Power",
    "Genset_L2_Power_Factor_PC2X": "Power",
    "Genset_L3_Power_Factor_PC2X": "Power",
    "Genset_Total_Power_Factor_calculated": "Power",
    "Genset_Standby_kW_Rating_PC2X": "Power",
    "Genset_Application_kW_Rating_PC2X": "Power",
    "Genset_Standby_kVA_Rating_PC2X": "Power",
    "Genset_Application_kVA_Rating_PC2X": "Power",
    "Power_Loss_Factor": "Power",

    // Other (all remaining)
    "Total_Fuel_Consumption_calculated": "Other",
    "Averagr_Engine_Speed": "Other",
    "Percent_Engine_Torque_or_Duty_Cycle": "Other",
    "Fuel_Outlet_Pressure_calculated": "Other",
    "Barometric_Absolute_Pressure": "Other",
    "Engine_Running_Time_calculated": "Other",
    "Fuel_Rate": "Other",
    "Oil_Pressure": "Other",
    "Boost_Pressure": "Other",
    "Base_Frequency_calculated": "Other",
    "V_Hz_Rolloff_Slope": "Other",
    "V_Hz_Knee_Frequency": "Other",
    "Genset_Frequency_OP_calculated": "Other",
    "Load_Percent": "Other",
    "Running_Hours": "Other",
    "Thermal_Stress": "Other",
    "Load_Stress": "Other",
    "Cooling_Margin": "Other",
    "OTSR": "Other",
    "Lubrication_Risk_Index": "Other",
    "Air_Fuel_Effectiveness": "Other",
    "Specific_Fuel_Consumption": "Other",
    "Heat_Rate": "Other",
    "Fuel_Flow_Change": "Other",
    "Mechanical_Stress": "Other",
    "RPM_Stability_Index": "Other",
    "Oscillation_Index": "Other",
    "Fuel_Consumption": "Other"
  };

  const categorized = {
    Current: [],
    Voltage: [],
    Temperature: [],
    Power: [],
    Other: [],
  };

  params.forEach((p) => {
    const category = manualMapping[p] || "Other"; 
    categorized[category].push(p);
  });

  // Sort each category alphabetically
  Object.keys(categorized).forEach((key) => {
    categorized[key].sort((a, b) => a.localeCompare(b));
  });

  return categorized;
};

function CustomTrend() {
  // -------- state --------
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const chartElRef = useRef(null);
  const chartRef = useRef(null);

  const [selectedMeter, setSelectedMeter] = useState([]);
  const [selectedParameter, setSelectedParameter] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [showMeters, setShowMeters] = useState(false);
  const [showParameters, setShowParameters] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [unitForExportFile, setUnitForExportFile] = useState("");
  const [showPdfBtn, setShowPdfBtn] = useState(false);
  const [metersFromAPI, setMetersFromAPI] = useState([]);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const [isRange, setIsRange] = useState(true);

  // New states for category toggles
  const [openCategoriesMeters, setOpenCategoriesMeters] = useState({});
  const [openCategoriesParameters, setOpenCategoriesParameters] = useState({});

  // Search states
  const [meterSearchTerm, setMeterSearchTerm] = useState("");
  const [parameterSearchTerm, setParameterSearchTerm] = useState("");

  const { theme } = useTheme();

  // -------- derived --------
  const isReady =
    !!startDate &&
    !!endDate &&
    (selectedMeter.length > 0 || selectedParameter.length > 0);

  const seriesKeys = useMemo(
    () => [...selectedMeter, ...selectedParameter].filter(Boolean),
    [selectedMeter, selectedParameter]
  );

  const categorized = useMemo(
    () => categorizeParameters(metersFromAPI),
    [metersFromAPI]
  );

  // Filtered categorized for meters
  const filteredCategorizedMeters = useMemo(() => {
    if (!meterSearchTerm.trim()) return categorized;

    const filtered = {};
    Object.entries(categorized).forEach(([cat, items]) => {
      const filteredItems = items
        .filter((item) =>
          getDisplayName(item)
            .toLowerCase()
            .includes(meterSearchTerm.toLowerCase())
        )
        .sort((a, b) => a.localeCompare(b));
      if (filteredItems.length > 0) {
        filtered[cat] = filteredItems;
      }
    });
    return filtered;
  }, [categorized, meterSearchTerm]);

  // Filtered categorized for parameters
  const filteredCategorizedParameters = useMemo(() => {
    if (!parameterSearchTerm.trim()) return categorized;

    const filtered = {};
    Object.entries(categorized).forEach(([cat, items]) => {
      const filteredItems = items
        .filter((item) =>
          getDisplayName(item)
            .toLowerCase()
            .includes(parameterSearchTerm.toLowerCase())
        )
        .sort((a, b) => a.localeCompare(b));
      if (filteredItems.length > 0) {
        filtered[cat] = filteredItems;
      }
    });
    return filtered;
  }, [categorized, parameterSearchTerm]);

  const selectedMeterNames = useMemo(
    () => selectedMeter.map(getDisplayName).join(", "),
    [selectedMeter]
  );
  const selectedParameterNames = useMemo(
    () => selectedParameter.map(getDisplayName).join(", "),
    [selectedParameter]
  );

  // -------- effects: initialize open categories --------
  useEffect(() => {
    const keys = Object.keys(categorized);
    const allClosed = keys.reduce((acc, k) => {
      acc[k] = false;
      return acc;
    }, {});
    setOpenCategoriesMeters(allClosed);
    setOpenCategoriesParameters(allClosed);
  }, [metersFromAPI]);

  // -------- effects: dropdown outside click --------
  const meterDropdownRef = useRef(null);
  const parameterDropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(e) {
      const t = e.target;
      if (meterDropdownRef.current && !meterDropdownRef.current.contains(t))
        setShowMeters(false);
      if (
        parameterDropdownRef.current &&
        !parameterDropdownRef.current.contains(t)
      )
        setShowParameters(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -------- effects: enforce end date min = start+1 --------
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

  // -------- effects: theme / dark mode detection --------
  useEffect(() => {
    const handleThemeChange = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    handleThemeChange();
    const mm = window.matchMedia("(prefers-color-scheme: dark)");
    mm.addEventListener("change", handleThemeChange);
    return () => {
      mm.removeEventListener("change", handleThemeChange);
    };
  }, []);

  useEffect(() => {
    fetch(`${config.BASE_URL}/trends/getlist`)
      .then((res) => res.json())
      .then((data) => {
        const uniqueData = [...new Set(data)];
        setMetersFromAPI(uniqueData);
      })
      .catch((err) => console.error("Error fetching meters:", err));
  }, []);

  useEffect(() => {
    if (seriesKeys.length === 0 || !startDate || !endDate) {
      setChartData([]);
      setShowPdfBtn(false);
      return;
    }

    setLoading(true);

    const payload = {
      mode: isRange ? "range" : "historic",
      startDate: `${startDate}T00:00:00.000Z`,
      endDate: `${endDate}T00:00:00.000Z`,
      params: seriesKeys,
    };

    fetch(`${config.BASE_URL}/trends`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((row) => {
          const dateObj = new Date(row.timestamp);
          const formattedRow = { Date: dateObj };
          Object.keys(row).forEach((key) => {
            if (key !== "timestamp") formattedRow[key] = row[key];
          });
          return formattedRow;
        });
        setChartData(formatted);
        setShowPdfBtn(formatted.length > 0);
      })
      .catch((err) => {
        console.error("Error fetching trend data:", err);
        setChartData([]);
        setShowPdfBtn(false);
      })
      .finally(() => setLoading(false));
  }, [startDate, endDate, seriesKeys, isRange]);

  const displaySeriesKeys = useMemo(
    () => seriesKeys.map(getDisplayName),
    [seriesKeys]
  );

  // -------- callbacks for toggling categories --------
  const toggleMeterCategory = useCallback((cat) => {
    setOpenCategoriesMeters((prev) => ({
      ...prev,
      [cat]: !(prev[cat] ?? false),
    }));
  }, []);

  const toggleParameterCategory = useCallback((cat) => {
    setOpenCategoriesParameters((prev) => ({
      ...prev,
      [cat]: !(prev[cat] ?? false),
    }));
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      try {
        chartRef.current.dispose();
      } catch {}
      chartRef.current = null;
    }
    if (!chartElRef.current) return;

    const chart = am4core.create(chartElRef.current, am4charts.XYChart);
    chart.logo.disabled = true;
    chart.cursor = new am4charts.XYCursor();
    chart.mouseWheelBehavior = "zoomX";
    chart.legend = new am4charts.Legend();
    chart.legend.position = "bottom";
    chart.data = [];

    chartRef.current = chart;

    const isDark = isDarkMode;
    const textColor = isDark ? "#fff" : "#000";

    // X axis
    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.dateFormatter.utc = true;
    dateAxis.renderer.labels.template.fontSize = 12;
    dateAxis.renderer.labels.template.fill = am4core.color(textColor);
    dateAxis.renderer.grid.template.stroke = am4core.color("#ccc");
    dateAxis.renderer.grid.template.strokeOpacity = 0.6;
    dateAxis.renderer.grid.template.strokeDasharray = "3,3";

    dateAxis.baseInterval = { timeUnit: "second", count: 3 };

    // Left Y axis (Primary)
    const valueAxisLeft = chart.yAxes.push(new am4charts.ValueAxis());
    const primaryKey = selectedMeter.length > 0 ? selectedMeter[0] : "";
    const primaryDisplayName = getDisplayName(primaryKey);
    const primaryUnit = getUnit(primaryKey);
    const primaryTitle = primaryUnit
      ? `${primaryDisplayName} (${primaryUnit})`
      : primaryDisplayName;

    valueAxisLeft.title.text = primaryTitle || "";
    valueAxisLeft.title.fill = am4core.color(textColor);
    valueAxisLeft.title.fontSize = 12;
    valueAxisLeft.renderer.labels.template.fontSize = 12;
    valueAxisLeft.renderer.labels.template.fill = am4core.color(textColor);
    valueAxisLeft.renderer.grid.template.stroke = am4core.color("#ccc");
    valueAxisLeft.renderer.grid.template.strokeOpacity = 0.6;
    valueAxisLeft.renderer.grid.template.strokeDasharray = "3,3";

    // Right Y axis (Secondary) - only if secondary parameters selected
    let valueAxisRight = null;
    if (selectedParameter.length > 0) {
      valueAxisRight = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxisRight.renderer.opposite = true;
      const secondaryKey = selectedParameter[0];
      const secondaryDisplayName = getDisplayName(secondaryKey);
      const secondaryUnit = getUnit(secondaryKey);
      const secondaryTitle = secondaryUnit
        ? `${secondaryDisplayName} (${secondaryUnit})`
        : secondaryDisplayName;
      valueAxisRight.title.text = secondaryTitle || "";
      valueAxisRight.title.fill = am4core.color(textColor);
      valueAxisRight.title.fontSize = 12;
      valueAxisRight.renderer.labels.template.fontSize = 12;
      valueAxisRight.renderer.labels.template.fill = am4core.color(textColor);
      valueAxisRight.renderer.grid.template.stroke = am4core.color("#ccc");
      valueAxisRight.renderer.grid.template.strokeOpacity = 0.6;
      valueAxisRight.renderer.grid.template.strokeDasharray = "3,3";
    }

    // Set unit for export based on primary or first available
    const exportKey =
      selectedMeter.length > 0
        ? selectedMeter[0]
        : selectedParameter.length > 0
        ? selectedParameter[0]
        : "";
    const exportDisplayName = getDisplayName(exportKey);
    const exportUnit = getUnit(exportKey);
    setUnitForExportFile(
      exportUnit ? `${exportDisplayName} (${exportUnit})` : exportDisplayName
    );

    chart.legend.labels.template.fill = am4core.color(textColor);
    chart.legend.labels.template.fontSize = 12;

    const colorList = [
      "#FF9933",
      "#A569BD",
      "#F7DC6F",
      "#8BC63E",
      "#E74C3C",
      "#3498DB",
      "#BDC3C7",
      "#000FE6",
      "#680056",
      "#1A5276",
    ];

    seriesKeys.forEach((keyName, i) => {
      const series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = "Date";
      series.dataFields.valueY = keyName;
      series.name = getDisplayName(keyName);
      series.stroke = am4core.color(colorList[i % colorList.length]);
      series.strokeWidth = 2;
      series.tooltipText = "{name}: [b]{valueY.formatNumber('#.##')}[/]";

      // Assign to appropriate Y axis
      const isSecondary = selectedParameter.includes(keyName);
      if (isSecondary && valueAxisRight) {
        series.yAxis = valueAxisRight;
      } else {
        series.yAxis = valueAxisLeft;
      }
    });

    // Horizontal Scrollbar Removed

    // if (!chart.scrollbarX) chart.scrollbarX = new am4charts.XYChartScrollbar();
    // const sb = chart.scrollbarX;
    // const gripColor = am4core.color(isDark ? "#cbd5e1" : "#9ca3af");

    // if (chart.series.length > 0 && sb.series.length === 0) {
    //   const src = chart.series.getIndex(0);
    //   const preview = sb.series.push(new am4charts.LineSeries());
    //   preview.dataFields.dateX = src.dataFields.dateX;
    //   preview.dataFields.valueY = src.dataFields.valueY;
    //   preview.strokeOpacity = 0.55;
    //   preview.stroke = am4core.color("#94a3b8");
    //   preview.fillOpacity = 0.08;
    // }

    // sb.height = 16;
    // sb.minHeight = 16;
    // sb.padding(0, 0, 0, 0);
    // sb.marginBottom = 0;
    // sb.background.fill = am4core.color(isDark ? "#334155" : "#e9ecef");
    // sb.background.fillOpacity = 1;
    // sb.background.stroke = am4core.color(isDark ? "#475569" : "#d1d5db");
    // sb.background.strokeOpacity = 1;
    // sb.background.cornerRadius(8, 8, 8, 8);
    // sb.unselectedOverlay.fill = am4core.color(isDark ? "#0b1220" : "#000000");
    // sb.unselectedOverlay.fillOpacity = isDark ? 0.12 : 0.06;
    // sb.unselectedOverlay.strokeOpacity = 0;
    // sb.thumb.minWidth = 48;
    // sb.thumb.background.fill = am4core.color(isDark ? "#475569" : "#ede6e6ff");
    // sb.thumb.background.fillOpacity = 0.9;
    // sb.thumb.background.stroke = am4core.color(isDark ? "#64748b" : "#cbd5e1");
    // sb.thumb.background.strokeOpacity = 1;
    // sb.thumb.background.strokeWidth = 1;

    // function applyChevronGrip(grip) {
    //   if (grip.icon) grip.icon.disabled = true;
    //   if (grip.background) {
    //     grip.background.fillOpacity = 0;
    //     grip.background.strokeOpacity = 0;
    //     grip.background.cornerRadius(0, 0, 0, 0);
    //   }
    //   const c = grip.createChild(am4core.Container);
    //   c.width = 12;
    //   c.height = 16;
    //   c.horizontalCenter = "middle";
    //   c.verticalCenter = "middle";
    //   c.align = "center";
    //   c.valign = "middle";

    //   const line = c.createChild(am4core.Line);
    //   line.x1 = 6;
    //   line.x2 = 6;
    //   line.y1 = 2;
    //   line.y2 = 14;
    //   line.stroke = gripColor;
    //   line.strokeWidth = 1.5;
    //   line.pixelPerfect = true;

    //   const up = c.createChild(am4core.Triangle);
    //   up.width = 6;
    //   up.height = 4;
    //   up.fill = gripColor;
    //   up.strokeOpacity = 0;
    //   up.x = 6;
    //   up.y = 4;
    //   up.horizontalCenter = "middle";
    //   up.verticalCenter = "middle";

    //   const down = c.createChild(am4core.Triangle);
    //   down.width = 6;
    //   down.height = 4;
    //   down.fill = gripColor;
    //   down.strokeOpacity = 0;
    //   down.rotation = 180;
    //   down.x = 6;
    //   down.y = 12;
    //   down.horizontalCenter = "middle";
    //   down.verticalCenter = "middle";

    //   const s = grip.states.create("hover");
    //   s.properties.scale = 1.08;
    // }
    // applyChevronGrip(sb.startGrip);
    // applyChevronGrip(sb.endGrip);

    return () => {
      try {
        chart.dispose();
      } catch {}
      chartRef.current = null;
    };
  }, [seriesKeys, selectedMeter, selectedParameter, isDarkMode]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.data = chartData || [];
    }
  }, [chartData]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const textColor = isDarkMode ? "#fff" : "#000";

    chart.legend.labels.template.fill = am4core.color(textColor);

    chart.yAxes.values.forEach((axis) => {
      axis.renderer.labels.template.fill = am4core.color(textColor);
      axis.title.fill = am4core.color(textColor);
    });
    chart.xAxes.values.forEach((axis) => {
      axis.renderer.labels.template.fill = am4core.color(textColor);
    });

    if (chart.scrollbarX) {
      const sb = chart.scrollbarX;
      sb.background.fill = am4core.color(isDarkMode ? "#334155" : "#e9ecef");
      sb.background.stroke = am4core.color(isDarkMode ? "#475569" : "#d1d5db");
      sb.unselectedOverlay.fill = am4core.color(
        isDarkMode ? "#0b1220" : "#000000"
      );
      sb.unselectedOverlay.fillOpacity = isDarkMode ? 0.12 : 0.06;
    }
  }, [isDarkMode]);

  const exportChartImage = (type) => {
    if (!chartRef.current) return;
    chartRef.current.exporting.filePrefix = "Customized_Trends";
    chartRef.current.exporting.export(type);
    setShowImageMenu(false);
  };

  const exportToExcel = async () => {
    if (chartData.length === 0) {
      alert("No data to export!");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Trend Data");

    const rows = chartData.map((row) => {
      const d = new Date(row.Date);
      const obj = {
        Date: d.toLocaleDateString(),
        Time: formatTime(d),
      };
      seriesKeys.forEach((k, i) => {
        const v = row?.[k];
        obj[displaySeriesKeys[i]] = Number.isFinite(v)
          ? +Number(v).toFixed(2)
          : v ?? "";
      });
      return obj;
    });

    const columns = ["Date", "Time", ...displaySeriesKeys];

    worksheet.getRow(1).height = 30;
    worksheet.getRow(2).height = 30;
    worksheet.getRow(3).height = 30;

    worksheet.mergeCells(1, 1, 1, columns.length);
    const t1 = worksheet.getCell(1, 1);
    t1.value = `Trend Data: ${unitForExportFile || "—"}`;
    t1.font = { bold: true, size: 16, color: { argb: "FF1D5999" } };
    t1.alignment = { horizontal: "center", vertical: "middle" };
    t1.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "cedef0" },
    };

    worksheet.mergeCells(2, 1, 2, columns.length);
    const t2 = worksheet.getCell(2, 1);
    t2.value = `Period: ${startDate || "—"} to ${endDate || "—"}`;
    t2.font = { bold: true, size: 16, color: { argb: "FF1D5999" } };
    t2.alignment = { horizontal: "center", vertical: "middle" };
    t2.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "cedef0" },
    };

    const headerRow = worksheet.getRow(3);
    headerRow.values = columns;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1D5999" },
      };
      cell.border = {
        top: { style: "thin", color: { argb: "cedef0" } },
        bottom: { style: "thin", color: { argb: "cedef0" } },
        left: { style: "thin", color: { argb: "cedef0" } },
        right: { style: "thin", color: { argb: "cedef0" } },
      };
    });

    rows.forEach((r) => worksheet.addRow(columns.map((c) => r[c])));
    worksheet.columns = columns.map(() => ({ width: 20 }));

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const safe = (s) =>
      String(s)
        .replace(/\s+/g, "_")
        .replace(/[:/\\]/g, "-");
    console.log(
      "Export to Excel would save:",
      `trend_data_${safe(unitForExportFile || "param")}_${safe(
        startDate || "NA"
      )}_to_${safe(endDate || "NA")}.xlsx`
    );
  };

  const exportToPDF = async () => {
    if (chartData.length === 0) {
      alert("No data to export!");
      return;
    }

    const headers = ["Date", "Time", ...displaySeriesKeys];
    const bodyRows = chartData.map((row) => {
      const d = new Date(row.Date);
      return [
        d.toLocaleDateString(),
        formatTime(d),
        ...seriesKeys.map((k) => {
          const v = row?.[k];
          return Number.isFinite(v) ? +Number(v).toFixed(2) : v ?? "";
        }),
      ];
    });

    const surajCottonBase64Logo = await loadImageAsBase64("/ifl-report.png");
    const jahaannBase64Logo = await loadImageAsBase64("/jahaann-light.png");

    const headerColumns = [];
    if (surajCottonBase64Logo)
      headerColumns.push({
        image: "surajcottonLogo",
        width: 100,
        alignment: "left",
      });
    headerColumns.push({ text: "", width: "*" });
    if (jahaannBase64Logo)
      headerColumns.push({
        image: "jahaannLogo",
        width: 100,
        alignment: "right",
      });

    const docDefinition = {
      pageOrientation: "landscape",
      content: [
        headerColumns.length
          ? { columns: headerColumns, margin: [0, 0, 0, 10] }
          : { text: "" },
        {
          columns: [
            {
              text: `Trend Data: ${unitForExportFile || "—"}`,
              style: "header",
              alignment: "left",
            },
            {
              text: `Time-Period: ${startDate || "—"} to ${endDate || "—"}`,
              style: "subheader",
              alignment: "right",
            },
          ],
          margin: [0, 0, 0, 20],
        },
        {
          table: {
            headerRows: 1,
            widths: Array(headers.length).fill("*"),
            body: [
              headers.map((h) => ({ text: h, style: "tableHeader" })),
              ...bodyRows,
            ],
          },
          layout: {
            fillColor: (rowIndex) => (rowIndex === 0 ? "#1D5999" : null),
            hLineColor: () => "#cedef0",
            vLineColor: () => "#cedef0",
            paddingLeft: () => 5,
            paddingRight: () => 5,
            paddingTop: () => 3,
            paddingBottom: () => 3,
          },
        },
      ],
      styles: {
        header: { fontSize: 16, bold: true, color: "#1D5999" },
        subheader: { fontSize: 12, bold: true, color: "#1D5999" },
        tableHeader: {
          bold: true,
          color: "white",
          fillColor: "#1D5999",
          alignment: "center",
        },
      },
      defaultStyle: { fontSize: 10, alignment: "center" },
      images: {
        ...(surajCottonBase64Logo
          ? { surajcottonLogo: surajCottonBase64Logo }
          : {}),
        ...(jahaannBase64Logo ? { jahaannLogo: jahaannBase64Logo } : {}),
      },
    };

    pdfMake
      .createPdf(docDefinition)
      .download(
        `trend_data_${(unitForExportFile || "param").replace(/\s+/g, "_")}_${
          startDate || "NA"
        }_to_${endDate || "NA"}.pdf`
      );
  };

  // -------- styles --------
  const dropdownBtn =
    "text-[12.5px] leading-[1.5rem] w-full p-[8px] border rounded-md text-left cursor-pointer bg-white dark:bg-[#2a2a2a] dark:border-gray-600 border-gray-300 hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200 shadow-sm";
  const dropdownMenu =
    "custom-scrollbar text-[12px] absolute bg-white border shadow-lg z-10 w-full max-h-48 overflow-y-auto rounded-md dark:bg-[#2a2a2a] dark:border-gray-600 border-gray-300";
  const dropdownLabel =
    "text-sm font-medium text-gray-700 dark:text-[#f5c518] block mb-1.5";
  const isDark = theme === "dark";

  const handleMeterChange = (val, checked) => {
    setSelectedMeter((prev) =>
      checked ? [...prev, val] : prev.filter((item) => item !== val)
    );
  };

  const handleParameterChange = (val, checked) => {
    setSelectedParameter((prev) =>
      checked ? [...prev, val] : prev.filter((item) => item !== val)
    );
  };

  const renderDropdownContent = (catEntries, openCategories, toggleCategory, handleChange, searchTerm, setSearchTerm, isMeters) => (
    <>
      <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-600">
        <input
          type="text"
          placeholder={`Search ${isMeters ? "primary" : "secondary"} parameters...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-2 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 dark:bg-[#2b2b2b] dark:text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 dark:focus:border-yellow-300 dark:focus:ring-yellow-300"
        />
      </div>
      {catEntries.length > 0 ? (
        catEntries.map(([cat, items]) => (
          <div
            key={cat}
            className="border-b border-gray-200 dark:border-gray-600 last:border-b-0"
          >
            <button
              onClick={() => toggleCategory(cat)}
              className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-left transition-colors duration-150 bg-gray-50 dark:bg-[#2a2a2a] hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <span>{cat}</span>
              <span>
                {openCategories[cat] ? (
                  <IoChevronUp size={16} />
                ) : (
                  <HiMiniChevronDown size={16} />
                )}
              </span>
            </button>
            {openCategories[cat] && (
              <div className="pl-4">
                {items.map((m, index) => (
                  <label
                    key={`${m}-${index}`}
                    title={m}
                    className="flex items-center px-4 py-2.5 truncate dark:hover:bg-gray-600 hover:bg-gray-50 dark:bg-[#2a2a2a] cursor-pointer transition-colors duration-150"
                  >
                    <input
                      type="checkbox"
                      value={m}
                      checked={isMeters ? selectedMeter.includes(m) : selectedParameter.includes(m)}
                      onChange={(e) => isMeters ? handleMeterChange(m, e.target.checked) : handleParameterChange(m, e.target.checked)}
                      className="mr-3 accent-[#f5c518] rounded"
                    />
                    <span className="max-w-[80%] truncate text-sm">
                      {getDisplayName(m)}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
          No results found
        </div>
      )}
    </>
  );

  return (
    <div className="w-full p-4 h-[91vh] bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 overflow-hidden custom-scrollbar">
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl Raleway text-[#626469] dark:text-white font-semibold">
            Customized Trend
          </h1>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm font-medium text-gray-700 dark:text-white">
              Range
            </span>
            {/* <Switch
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
            /> */}
            <Switch
              onChange={setIsRange}
              checked={isRange}
              className="react-switch"
              onColor={isDark ? "#ffffff" : "#000000"}
              offColor={isDark ? "#6B7280" : "#E5E7EB"}
              onHandleColor={isDark ? "#000000" : "#ffffff"}
              offHandleColor={isDark ? "#ffffff" : "#000000"}
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

        <div className="flex flex-col w-full gap-4 mb-4 md:grid md:grid-cols-4 md:gap-4">
          {/* Start Date */}
          <div className="w-full">
            <label className={dropdownLabel}>Start Date</label>
            <div className="relative w-full">
              <input
                ref={startDateRef}
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 pr-10 text-sm border-2 border-gray-300 rounded-md dark:bg-[#2a2a2a] dark:border-gray-700 dark:text-white focus:border-yellow-500 dark:focus:border-yellow-300 focus:outline-none transition-colors duration-200 hide-calendar-icon"
              />
              <FaCalendarAlt
                className="absolute text-gray-500 transition-colors duration-200 -translate-y-1/2 cursor-pointer right-3 top-1/2 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400"
                onClick={() => startDateRef.current?.showPicker()}
              />
            </div>
          </div>

          {/* End Date */}
          <div className="w-full">
            <label className={dropdownLabel}>End Date</label>
            <div className="relative w-full">
              <input
                ref={endDateRef}
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2.5 pr-10 text-sm border-2 border-gray-300 rounded-md dark:bg-[#2a2a2a] dark:border-gray-700 dark:text-white focus:border-yellow-500 dark:focus:border-yellow-300 focus:outline-none transition-colors duration-200 hide-calendar-icon"
              />
              <FaCalendarAlt
                className="absolute text-gray-500 transition-colors duration-200 -translate-y-1/2 cursor-pointer right-3 top-1/2 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400"
                onClick={() => endDateRef.current?.showPicker()}
              />
            </div>
          </div>

          {/* Primary Axis */}
          <div ref={meterDropdownRef} className="relative w-full">
            <label className={dropdownLabel}>Primary Axis</label>
            <button
              onClick={() => setShowMeters(!showMeters)}
              className={`${dropdownBtn} flex items-center justify-between`}
            >
              <span className="truncate max-w-[85%]">
                {selectedMeter.length
                  ? selectedMeterNames
                  : "Select Primary Axis"}
              </span>
              <span className="flex-shrink-0 ml-2">
                {showMeters ? (
                  <IoChevronUp size={20} />
                ) : (
                  <HiMiniChevronDown size={25} />
                )}
              </span>
            </button>
            {showMeters && (
              <div className={dropdownMenu}>
                {renderDropdownContent(
                  Object.entries(filteredCategorizedMeters),
                  openCategoriesMeters,
                  toggleMeterCategory,
                  handleMeterChange,
                  meterSearchTerm,
                  setMeterSearchTerm,
                  true
                )}
              </div>
            )}
          </div>

          {/* Secondary Axis */}
          <div ref={parameterDropdownRef} className="relative w-full">
            <label className={dropdownLabel}>Secondary Axis</label>
            <button
              onClick={() => setShowParameters(!showParameters)}
              className={`${dropdownBtn} flex items-center justify-between`}
            >
              <span className="truncate max-w-[85%]">
                {selectedParameter.length
                  ? selectedParameterNames
                  : "Select Secondary Axis"}
              </span>

              <span className="flex-shrink-0 ml-2">
                {showParameters ? (
                  <IoChevronUp size={20} />
                ) : (
                  <HiMiniChevronDown size={25} />
                )}
              </span>
            </button>

            {showParameters && (
              <div className={dropdownMenu}>
                {renderDropdownContent(
                  Object.entries(filteredCategorizedParameters),
                  openCategoriesParameters,
                  toggleParameterCategory,
                  handleParameterChange,
                  parameterSearchTerm,
                  setParameterSearchTerm,
                  false
                )}
              </div>
            )}
          </div>
        </div>

        {/* Chart + Export */}
        <div className="flex-1 w-full">
          <div className="relative">
            <div className="flex-1 w-full">
              {showPdfBtn && (
                <div className="relative flex justify-end gap-3 mb-3">
                  {/* Images */}
                  <div className="relative">
                    <button
                      onClick={() => setShowImageMenu((s) => !s)}
                      title="Export as image"
                      aria-label="Export as image"
                      className="p-2.5 rounded-full bg-[#f8f9fa] hover:bg-[#e9ecef] dark:bg-gray-700 dark:hover:bg-gray-600 shadow-sm cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-gray-600"
                    >
                      <FaImage className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                    {showImageMenu && (
                      <div className="absolute right-0 z-30 py-1 mt-2 bg-white border rounded-lg shadow-lg w-28 dark:bg-gray-800 dark:border-gray-600">
                        <button
                          onClick={() => exportChartImage("png")}
                          className="w-full px-3 py-2 text-sm text-left transition-colors duration-150 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          PNG
                        </button>
                        <button
                          onClick={() => exportChartImage("jpg")}
                          className="w-full px-3 py-2 text-sm text-left transition-colors duration-150 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          JPG
                        </button>
                        <button
                          onClick={() => exportChartImage("svg")}
                          className="w-full px-3 py-2 text-sm text-left transition-colors duration-150 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          SVG
                        </button>
                      </div>
                    )}
                  </div>

                  {/* PDF */}
                  <button
                    onClick={exportToPDF}
                    title="Export as PDF"
                    aria-label="Export as PDF"
                    className="p-2.5 rounded-full bg-[#f8f9fa] hover:bg-[#e9ecef] dark:bg-gray-700 dark:hover:bg-gray-600 shadow-sm cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-gray-600"
                  >
                    <FaFilePdf className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>

                  {/* Excel */}
                  <button
                    onClick={exportToExcel}
                    title="Export as Excel"
                    aria-label="Export as Excel"
                    className="p-2.5 rounded-full bg-[#f8f9fa] hover:bg-[#e9ecef] dark:bg-gray-700 dark:hover:bg-gray-600 shadow-sm cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-gray-600"
                  >
                    <FaFileExcel className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </button>
                </div>
              )}
            </div>

            <div className="relative w-full" style={{ height: "64vh" }}>
              <div
                ref={chartElRef}
                id="chartDiv"
                className="w-full h-full bg-white rounded-lg dark:bg-[#2a2a2a] shadow-sm"
              />
              {!isReady && !loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 dark:bg-[#1e1e1e]/95 backdrop-blur-sm rounded-lg">
                  <Image
                    src="/trend_icon.svg"
                    alt="alt-img"
                    width={800}
                    height={400}
                    className="h-[40vh] w-[80vh] opacity-80"
                  />

                  <p className="mt-4 font-bold text-gray-600 dark:text-gray-300">
                    Select Desired Filters to view Trend!
                  </p>
                </div>
              )}
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-[#2a2a2a]/90 backdrop-blur-sm rounded-lg">
                  <div className="loader" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomTrend;
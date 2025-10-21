"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
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

function CustomTrend() {
  // -------- state --------
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const chartElRef = useRef(null);
  const chartRef = useRef(null);

  const [area, setArea] = useState("");
  const [lt, setLt] = useState("");
  const [selectedMeter, setSelectedMeter] = useState([]);
  const [selectedParameter, setSelectedParameter] = useState("");
  const [chartData, setChartData] = useState([]);
  const [showMeters, setShowMeters] = useState(false);
  const [showParameters, setShowParameters] = useState(false);
  const [showArea, setShowArea] = useState(false);
  const [showLT, setShowLT] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [unitForExportFile, setUnitForExportFile] = useState("");
  const [showPdfBtn, setShowPdfBtn] = useState(false);
  const [metersFromAPI, setMetersFromAPI] = useState([]);
  const [showImageMenu, setShowImageMenu] = useState(false);

  const { theme } = useTheme();

  // -------- derived --------
  const isReady =
    !!startDate &&
    !!endDate &&
    !!area &&
    !!lt &&
    selectedMeter.length > 0 &&
    !!selectedParameter;

  const hardcodedAreas = useMemo(() => ["Process", "Chiller"], []);
  const hardcodedLTByArea = useMemo(
    () => ({
      Chiller: [
        { key: "CHCT1", label: "3851-E07" },
        { key: "CHCT2", label: "3851-E08" },
      ],
      Process: [
        { key: "CT1", label: "4101-E05" },
        { key: "CT2", label: "4101-E06" },
      ],
    }),
    []
  );

  const seriesKeys = useMemo(
    () =>
      selectedMeter.length && selectedParameter && lt
        ? selectedMeter.map((m) => `${lt}_${m}_${selectedParameter}`)
        : [],
    [selectedMeter, lt, selectedParameter]
  );

  // Using selected meter’s suffix list
  const parameters = useMemo(() => {
    if (selectedMeter.length === 0) return [];
    const chosen = selectedMeter[0];
    const meterObj = metersFromAPI.find((m) => m.meterId === chosen);
    return meterObj?.suffixes ? [...meterObj.suffixes] : [];
  }, [selectedMeter, metersFromAPI]);

  // suffix → unit mapping for Y-axis label & export title
  const suffixUnitMap = useMemo(
    () => ({
      FR: "m³/h",
      TOT: "m³",
      AI: "",
      Voltage_AN_V: "V",
      Voltage_BN_V: "V",
      Voltage_CN_V: "V",
      Voltage_LN_V: "V",
      Voltage_AB_V: "V",
      Voltage_BC_V: "V",
      Voltage_CA_V: "V",
      Voltage_LL_V: "V",
      Current_AN_Amp: "A",
      Current_BN_Amp: "A",
      Current_CN_Amp: "A",
      Current_Total_Amp: "A",
      Frequency_Hz: "Hz",
      ActivePower_A_kW: "kW",
      ActivePower_B_kW: "kW",
      ActivePower_C_kW: "kW",
      ActivePower_Total_kW: "kW",
      ReactivePower_A_kVAR: "kVAR",
      ReactivePower_B_kVAR: "kVAR",
      ReactivePower_C_kVAR: "kVAR",
      ReactivePower_Total_kVAR: "kVAR",
      ApparentPower_A_kVA: "kVA",
      ApparentPower_B_kVA: "kVA",
      ApparentPower_C_kVA: "kVA",
      ApparentPower_Total_kVA: "kVA",
      ActiveEnergy_A_kWh: "kWh",
      ActiveEnergy_B_kWh: "kWh",
      ActiveEnergy_C_kWh: "kWh",
      ActiveEnergy_Total_kWh: "kWh",
      ActiveEnergy_A_Received_kWh: "kWh",
      ActiveEnergy_B_Received_kWh: "kWh",
      ActiveEnergy_C_Received_kWh: "kWh",
      ActiveEnergy_Total_Received_kWh: "kWh",
      ActiveEnergy_A_Delivered_kWh: "kWh",
      ActiveEnergy_B_Delivered_kWh: "kWh",
      ActiveEnergy_C_Delivered_kWh: "kWh",
      ActiveEnergy_Total_Delivered_kWh: "kWh",
      ApparentEnergy_A_kVAh: "kVAh",
      ApparentEnergy_B_kVAh: "kVAh",
      ApparentEnergy_C_kVAh: "kVAh",
      ApparentEnergy_Total_kVAh: "kVAh",
      ReactiveEnergy_A_kVARh: "kVARh",
      ReactiveEnergy_B_kVARh: "kVARh",
      ReactiveEnergy_C_kVARh: "kVARh",
      ReactiveEnergy_Total_kVARh: "kVARh",
      ReactiveEnergy_A_Inductive_kVARh: "kVARh",
      ReactiveEnergy_B_Inductive_kVARh: "kVARh",
      ReactiveEnergy_C_Inductive_kVARh: "kVARh",
      ReactiveEnergy_Total_Inductive_kVARh: "kVARh",
      ReactiveEnergy_A_Capacitive_kVARh: "kVARh",
      ReactiveEnergy_B_Capacitive_kVARh: "kVARh",
      ReactiveEnergy_C_Capacitive_kVARh: "kVARh",
      ReactiveEnergy_Total_Capacitive_kVARh: "kVARh",
      Harmonics_V1_THD: "%",
      Harmonics_V2_THD: "%",
      Harmonics_V3_THD: "%",
      Harmonics_I1_THD: "%",
      Harmonics_I2_THD: "%",
      Harmonics_I3_THD: "%",
      PowerFactor_A: "",
      PowerFactor_B: "",
      PowerFactor_C: "",
      PowerFactor_Total: "",
      DI: "",
    }),
    []
  );

  // -------- effects: dropdown outside click --------
  const meterDropdownRef = useRef(null);
  const parameterDropdownRef = useRef(null);
  const areaDropdownRef = useRef(null);
  const ltDropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(e) {
      const t = e.target;
      if (meterDropdownRef.current && !meterDropdownRef.current.contains(t)) setShowMeters(false);
      if (parameterDropdownRef.current && !parameterDropdownRef.current.contains(t)) setShowParameters(false);
      if (areaDropdownRef.current && !areaDropdownRef.current.contains(t)) setShowArea(false);
      if (ltDropdownRef.current && !ltDropdownRef.current.contains(t)) setShowLT(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -------- effects: enforce end date min = start+1 --------
  // useEffect(() => {
  //   if (startDate && endDateRef.current) {
  //     // const nextDay = new Date(startDate);
  //     // nextDay.setDate(nextDay.getDate() + 1);
  //     endDateRef.current.min = new Date(startDate).toISOString().split("T")[0];
  //   }
  // }, [startDate]);

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

  const meterDisplayNamesByLT = {
    CHCT1: {
      FM_01: "FQI-51-71",
      FM_02: "FQI-51-78",
      TEMP_RTD_01: "TI-51-72",
      TEMP_RTD_02: "TI-51-71",
      PT_01: "PI-51-71",
      INV_01_SPD: "E07-1M1",
      LLS_01: "LS-51-71",
      LS_01: "LS-51-72",
      VS_FAN_01: "VS-51-73",
      EM01: "EM07-1M1",
    },
    CHCT2: {
      FM_01: "FQI-51-81",
      FM_02: "FQI-51-88",  
      TEMP_RTD_01: "TI-51-82",
      TEMP_RTD_02: "T1-51-81",
      PT_01: "PI-51-78",
      INV_01_SPD: "E08-1M1",
      LLS_01: "LS-51-81",
      LS_01: "LS-51-82",
      VS_FAN_01: "VS-51-83",
      EM01: "EM08-1M1",
    },
    CT1: {
      FM_01: "FQI-01-05",
      FM_02: "FI-01-07",
      TEMP_RTD_01: "TI-01-41",
      TEMP_RTD_02: "TI-01-44",
      PT_01: "PI-01-56",
      INV_01_SPD: "E05-1M1",
      LLS_01: "LS-01-41",
      LS_01: "LS-01-61",
      VS_FAN_01: "VS-01-43",
      EM01: "EM05-1M1",
    },
    CT2: {
      FM_01: "FQI-01-06",
      FM_02: "FI-01-08",
      TEMP_RTD_01: "TI-01-51",
      TEMP_RTD_02: "TI-01-54",
      PT_01: "PI-01-56",
      INV_01_SPD: "E06-1M1",
      LLS_01: "LS-01-51",
      LS_01: "LS-01-71",
      VS_FAN_01: "VS-01-53",
      EM01: "EM06-1M1",
    },
  };

  const parameterDisplayNamesByLT = {
    CHCT1: {
      FR: "Flow Rate",
      TOT: "Totalizer",
      AI: "Analog Input",
      DI: "Digital Input",
    },
    CHCT2: {
        FR: "Flow Rate",
      TOT: "Totalizer",
      AI: "Analog Input",
      DI: "Digital Input",
    },
    CT1: {
       FR: "Flow Rate",
      TOT: "Totalizer",
      AI: "Analog Input",
      DI: "Digital Input",
    },
    CT2: {
      FR: "Flow Rate",
      TOT: "Totalizer",
      AI: "Analog Input",
      DI: "Digital Input",
    },
  };

  const meterDisplayNames = meterDisplayNamesByLT[lt] || {};
  const parameterDisplayNames = parameterDisplayNamesByLT[lt] || {};


  // -------- effects: fetch available meters when area/lt change --------
  useEffect(() => {
    if (!area || !lt) {
      setMetersFromAPI([]);
      return;
    }
    fetch(`${config.BASE_URL}/trends/getlist`)
      .then((res) => res.json())
      .then((data) => setMetersFromAPI(data))
      .catch((err) => console.error("Error fetching meters:", err));
  }, [area, lt]);

  // -------- effects: fetch trend data when filters change --------
  useEffect(() => {
    if (!selectedParameter || selectedMeter.length === 0 || !area || !lt || !startDate || !endDate) {
      setChartData([]);
      setShowPdfBtn(false);
      return;
    }

    setLoading(true);

    const payload = {
      start_date: startDate,
      end_date: endDate,
      meterIds: selectedMeter,
      suffixes: [selectedParameter],
      area: area,
      LT_selections: lt,
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
  }, [startDate, endDate, selectedParameter, selectedMeter, area, lt]);

  // -------- effect A: (re)create chart + axes + series when structural inputs change --------
  useEffect(() => {
    // dispose previous (if any)
    if (chartRef.current) {
      try {
        chartRef.current.dispose();
      } catch { }
      chartRef.current = null;
    }
    if (!chartElRef.current) return;

    const chart = am4core.create(chartElRef.current, am4charts.XYChart);
    chart.logo.disabled = true;
    chart.cursor = new am4charts.XYCursor();
    chart.mouseWheelBehavior = "zoomX";
    chart.legend = new am4charts.Legend();
    chart.legend.position = "bottom";
    chart.data = []; // set by effect B

    chartRef.current = chart;

    const isDark = isDarkMode;
    const textColor = isDark ? "#fff" : "#000";

    // X axis
    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.labels.template.fontSize = 12;
    dateAxis.renderer.labels.template.fill = am4core.color(textColor);
    dateAxis.renderer.grid.template.stroke = am4core.color("#ccc");
    dateAxis.renderer.grid.template.strokeOpacity = 0.6;
    dateAxis.renderer.grid.template.strokeDasharray = "3,3";

    dateAxis.baseInterval = { timeUnit: "minute", count: 15 };

    // Y axis
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  const unit = suffixUnitMap[selectedParameter] ?? "";
  const yTitle = unit ? `${parameterDisplayNames[selectedParameter] || selectedParameter} (${unit})` : (parameterDisplayNames[selectedParameter] || selectedParameter);
  setUnitForExportFile(yTitle);

    valueAxis.title.text = yTitle || "";
    valueAxis.title.fill = am4core.color(textColor);
    valueAxis.title.fontSize = 12;
    valueAxis.renderer.labels.template.fontSize = 12;
    valueAxis.renderer.labels.template.fill = am4core.color(textColor);
    valueAxis.renderer.grid.template.stroke = am4core.color("#ccc");
    valueAxis.renderer.grid.template.strokeOpacity = 0.6;
    valueAxis.renderer.grid.template.strokeDasharray = "3,3";

    chart.legend.labels.template.fill = am4core.color(textColor);
    chart.legend.labels.template.fontSize = 12;

    // Series
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

    selectedMeter.forEach((meterId, i) => {
  const keyName = `${lt}_${meterId}_${selectedParameter}`;
  const series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.dateX = "Date";
  series.dataFields.valueY = keyName;
  series.name = meterDisplayNames[meterId] ? `${meterDisplayNames[meterId]} - ${parameterDisplayNames[selectedParameter] || selectedParameter}` : keyName;
  series.stroke = am4core.color(colorList[i % colorList.length]);
  series.strokeWidth = 2;
  series.tooltipText = "{dateX}: [b]{valueY.formatNumber('#.##')}[/]";
    });

    // Scrollbar + preview
    if (!chart.scrollbarX) chart.scrollbarX = new am4charts.XYChartScrollbar();
    const sb = chart.scrollbarX;
    const gripColor = am4core.color(isDark ? "#cbd5e1" : "#9ca3af");

    if (chart.series.length > 0 && sb.series.length === 0) {
      const src = chart.series.getIndex(0);
      const preview = sb.series.push(new am4charts.LineSeries());
      preview.dataFields.dateX = src.dataFields.dateX;
      preview.dataFields.valueY = src.dataFields.valueY;
      preview.strokeOpacity = 0.55;
      preview.stroke = am4core.color("#94a3b8");
      preview.fillOpacity = 0.08;
    }

    sb.height = 16;
    sb.minHeight = 16;
    sb.padding(0, 0, 0, 0);
    sb.marginBottom = 0;
    sb.background.fill = am4core.color(isDark ? "#334155" : "#e9ecef");
    sb.background.fillOpacity = 1;
    sb.background.stroke = am4core.color(isDark ? "#475569" : "#d1d5db");
    sb.background.strokeOpacity = 1;
    sb.background.cornerRadius(8, 8, 8, 8);
    sb.unselectedOverlay.fill = am4core.color(isDark ? "#0b1220" : "#000000");
    sb.unselectedOverlay.fillOpacity = isDark ? 0.12 : 0.06;
    sb.unselectedOverlay.strokeOpacity = 0;
    sb.thumb.minWidth = 48;
    sb.thumb.background.fill = am4core.color(isDark ? "#475569" : "#ede6e6ff");
    sb.thumb.background.fillOpacity = 0.9;
    sb.thumb.background.stroke = am4core.color(isDark ? "#64748b" : "#cbd5e1");
    sb.thumb.background.strokeOpacity = 1;
    sb.thumb.background.strokeWidth = 1;

    function applyChevronGrip(grip) {
      if (grip.icon) grip.icon.disabled = true;
      if (grip.background) {
        grip.background.fillOpacity = 0;
        grip.background.strokeOpacity = 0;
        grip.background.cornerRadius(0, 0, 0, 0);
      }
      const c = grip.createChild(am4core.Container);
      c.width = 12;
      c.height = 16;
      c.horizontalCenter = "middle";
      c.verticalCenter = "middle";
      c.align = "center";
      c.valign = "middle";

      const line = c.createChild(am4core.Line);
      line.x1 = 6;
      line.x2 = 6;
      line.y1 = 2;
      line.y2 = 14;
      line.stroke = gripColor;
      line.strokeWidth = 1.5;
      line.pixelPerfect = true;

      const up = c.createChild(am4core.Triangle);
      up.width = 6;
      up.height = 4;
      up.fill = gripColor;
      up.strokeOpacity = 0;
      up.x = 6;
      up.y = 4;
      up.horizontalCenter = "middle";
      up.verticalCenter = "middle";

      const down = c.createChild(am4core.Triangle);
      down.width = 6;
      down.height = 4;
      down.fill = gripColor;
      down.strokeOpacity = 0;
      down.rotation = 180;
      down.x = 6;
      down.y = 12;
      down.horizontalCenter = "middle";
      down.verticalCenter = "middle";

      const s = grip.states.create("hover");
      s.properties.scale = 1.08;
    }
    applyChevronGrip(sb.startGrip);
    applyChevronGrip(sb.endGrip);

    return () => {
      try {
        chart.dispose();
      } catch { }
      chartRef.current = null;
    };
    // Rebuild chart when structural inputs change (NOT on data change)
  }, [selectedMeter, selectedParameter, lt, isDarkMode, suffixUnitMap]);

  // -------- effect B: update chart DATA only when chartData changes --------
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.data = chartData || [];
    }
  }, [chartData]);

  // -------- effect C: update dark/light styles without rebuilding --------
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const textColor = isDarkMode ? "#fff" : "#000";

    // Legend
    chart.legend.labels.template.fill = am4core.color(textColor);

    // Axes
    chart.yAxes.values.forEach((axis) => {
      axis.renderer.labels.template.fill = am4core.color(textColor);
      axis.title.fill = am4core.color(textColor);
    });
    chart.xAxes.values.forEach((axis) => {
      axis.renderer.labels.template.fill = am4core.color(textColor);
    });

    // Scrollbar track color update (optional)
    if (chart.scrollbarX) {
      const sb = chart.scrollbarX;
      sb.background.fill = am4core.color(isDarkMode ? "#334155" : "#e9ecef");
      sb.background.stroke = am4core.color(isDarkMode ? "#475569" : "#d1d5db");
      sb.unselectedOverlay.fill = am4core.color(isDarkMode ? "#0b1220" : "#000000");
      sb.unselectedOverlay.fillOpacity = isDarkMode ? 0.12 : 0.06;
    }
  }, [isDarkMode]);

  // -------- export handlers --------
  const exportChartImage = (type) => {
    if (!chartRef.current) return;
    chartRef.current.exporting.filePrefix = "Customized_Trends";
    chartRef.current.exporting.export(type);
    setShowImageMenu(false);
  };

  const exportToExcel = async () => {
    if (chartData.length === 0) {
      Swal.fire({ icon: "error", title: "Error", text: "No data to export!" });
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
      seriesKeys.forEach((k) => {
        const v = row?.[k];
        obj[k] = Number.isFinite(v) ? +Number(v).toFixed(2) : v ?? "";
      });
      return obj;
    });

    const columns = ["Date", "Time", ...seriesKeys];

    worksheet.getRow(1).height = 30;
    worksheet.getRow(2).height = 30;
    worksheet.getRow(3).height = 30;

    worksheet.mergeCells(1, 1, 1, columns.length);
    const t1 = worksheet.getCell(1, 1);
    t1.value = `Trend Data: ${selectedParameter || "—"}`;
    t1.font = { bold: true, size: 16, color: { argb: "FF1D5999" } };
    t1.alignment = { horizontal: "center", vertical: "middle" };
    t1.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "cedef0" } };

    worksheet.mergeCells(2, 1, 2, columns.length);
    const t2 = worksheet.getCell(2, 1);
    t2.value = `Period: ${startDate || "—"} to ${endDate || "—"}`;
    t2.font = { bold: true, size: 16, color: { argb: "FF1D5999" } };
    t2.alignment = { horizontal: "center", vertical: "middle" };
    t2.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "cedef0" } };

    const headerRow = worksheet.getRow(3);
    headerRow.values = columns;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1D5999" } };
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
    const safe = (s) => String(s).replace(/\s+/g, "_").replace(/[:/\\]/g, "-");
    saveAs(
      blob,
      `trend_data_${safe(selectedParameter || "param")}_${safe(startDate || "NA")}_to_${safe(
        endDate || "NA"
      )}.xlsx`
    );
  };

  const exportToPDF = async () => {
    if (chartData.length === 0) {
      Swal.fire({ icon: "error", title: "Error", text: "No data to export!" });
      return;
    }

    const headers = ["Date", "Time", ...seriesKeys];
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
    if (surajCottonBase64Logo) headerColumns.push({ image: "surajcottonLogo", width: 100, alignment: "left" });
    headerColumns.push({ text: "", width: "*" });
    if (jahaannBase64Logo) headerColumns.push({ image: "jahaannLogo", width: 100, alignment: "right" });

    const docDefinition = {
      pageOrientation: "landscape",
      content: [
        headerColumns.length ? { columns: headerColumns, margin: [0, 0, 0, 10] } : { text: "" },
        {
          columns: [
            {
              text: `Trend Data: ${unitForExportFile || selectedParameter || "—"}`,
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
            body: [headers.map((h) => ({ text: h, style: "tableHeader" })), ...bodyRows],
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
        tableHeader: { bold: true, color: "white", fillColor: "#1D5999", alignment: "center" },
      },
      defaultStyle: { fontSize: 10, alignment: "center" },
      images: {
        ...(surajCottonBase64Logo ? { surajcottonLogo: surajCottonBase64Logo } : {}),
        ...(jahaannBase64Logo ? { jahaannLogo: jahaannBase64Logo } : {}),
      },
    };

    pdfMake
      .createPdf(docDefinition)
      .download(
        `trend_data_${(selectedParameter || "param").replace(/\s+/g, "_")}_${startDate || "NA"}_to_${endDate || "NA"
        }.pdf`
      );
  };

  // -------- styles --------
  const dropdownBtn =
    "text-[12.5px] leading-[1.5rem] w-full p-[5.5px] border rounded text-left cursor-pointer bg-white dark:bg-gray-700 dark:border-gray-600 border-2 truncate";
  const dropdownMenu =
    "custom-scrollbar text-[12px] absolute bg-white border shadow z-10 w-full max-h-48 overflow-y-auto dark:bg-gray-700 dark:border-gray-600 border-2";
  const dropdownLabel = "text-sm font-medium text-gray-700 dark:text-gray-200 block mb-1";

  return (
    <div className="w-full p-4 h-[81vh] rounded-[8px] bg-white dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600 !border-t-4 !border-t-[#1d5999] overflow-x-auto custom-scrollbar">
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl Raleway text-[#626469] dark:text-white font-semibold">
            <h1 className="Raleway">Customized Trend</h1>
          </span>
        </div>

        <div className="flex flex-col w-full gap-4 mb-6 md:grid md:grid-cols-6 md:gap-4">
          {/* Start Date */}
          <div className="w-full">
            <label className={dropdownLabel}>Start Date</label>
            <div className="relative w-full">
              <input
                ref={startDateRef}
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 pr-10 text-sm border border-2 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white hide-calendar-icon"
              />
              <FaCalendarAlt
                className="absolute text-gray-500 -translate-y-1/2 cursor-pointer right-3 top-1/2 dark:text-white"
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
                className="w-full px-3 py-2 pr-10 text-sm border border-2 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white hide-calendar-icon"
              />
              <FaCalendarAlt
                className="absolute text-gray-500 -translate-y-1/2 cursor-pointer right-3 top-1/2 dark:text-white"
                onClick={() => endDateRef.current?.showPicker()}
              />
            </div>
          </div>

          {/* Area */}
          <div ref={areaDropdownRef} className="relative w-full">
            <label className={dropdownLabel}>Select Area</label>
            <button onClick={() => setShowArea(!showArea)} className={dropdownBtn}>
              {area || "Select Area"}
              <span className="float-right">
                {showArea ? <IoChevronUp size={20} /> : <HiMiniChevronDown size={25} />}
              </span>
            </button>
            {showArea && (
              <div className={dropdownMenu}>
                {hardcodedAreas.map((a) => (
                  <label key={a} className="block px-4 py-2 truncate dark:hover:bg-gray-600 hover:bg-gray-100">
                    <input
                      type="radio"
                      name="area"
                      value={a}
                      checked={area === a}
                      onChange={(e) => {
                        setArea(e.target.value);
                        setShowArea(false);
                        setLt("");
                        setSelectedMeter([]);
                        setSelectedParameter("");
                      }}
                      className="mr-2"
                    />
                    {a}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Tower / LT */}
          <div ref={ltDropdownRef} className="relative w-full">
            <label className={dropdownLabel}>Select Tower</label>
            <button
              disabled={!area}
              onClick={() => area && setShowLT(!showLT)}
              className={`${dropdownBtn} ${!area ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {hardcodedLTByArea[area]?.find((v) => v.key === lt)?.label || "Select Tower"}
              <span className="float-right">
                {showLT ? <IoChevronUp size={20} /> : <HiMiniChevronDown size={25} />}
              </span>
            </button>
            {showLT && (
              <div className={dropdownMenu}>
                {hardcodedLTByArea[area]?.map((v) => (
                  <label key={v.key} className="block px-4 py-2 truncate dark:hover:bg-gray-600 hover:bg-gray-100">
                    <input
                      type="radio"
                      name="lt"
                      value={v.key}
                      checked={lt === v.key}
                      onChange={(e) => {
                        setLt(e.target.value);
                        setShowLT(false);
                        setSelectedMeter([]);
                        setSelectedParameter("");
                      }}
                      className="mr-2"
                    />
                    {v.label}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Meter */}
          <div ref={meterDropdownRef} className="relative w-full">
            <label className={dropdownLabel}>Select Device</label>
            <button onClick={() => setShowMeters(!showMeters)} className={dropdownBtn}>
              {selectedMeter.length ? (meterDisplayNames[selectedMeter[0]] || selectedMeter[0]) : "Select Device"}
              <span className="float-right">
                {showMeters ? <IoChevronUp size={20} /> : <HiMiniChevronDown size={25} />}
              </span>
            </button>
            {showMeters && (
              <div className={dropdownMenu}>
                {metersFromAPI.map((m) => (
                  <label
                    key={m.meterId}
                    title={meterDisplayNames[m.meterId] || m.meterId}
                    className="block px-4 py-2 truncate dark:hover:bg-gray-600 hover:bg-gray-100"
                  >
                    <input
                      type="radio"
                      name="meter"
                      value={m.meterId}
                      checked={selectedMeter[0] === m.meterId}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedMeter([val]);
                        setShowMeters(false);
                        setSelectedParameter((prev) => (m.suffixes || []).includes(prev) ? prev : "");
                      }}
                      className="mr-2"
                    />
                    <span className="inline-block max-w-[80%] truncate align-middle">{meterDisplayNames[m.meterId] || m.meterId}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Parameter */}
          <div ref={parameterDropdownRef} className="relative w-full">
            <label className={dropdownLabel}>Select Parameter</label>
            {/* <button onClick={() => setShowParameters(!showParameters)} className={dropdownBtn}>
              {selectedParameter ? (parameterDisplayNames[selectedParameter] || selectedParameter) : "Select Parameter"}
              <span className="float-right">
                {showParameters ? <IoChevronUp size={20} /> : <HiMiniChevronDown size={25} />}
              </span>
            </button> */}
            <button
  onClick={() => setShowParameters(!showParameters)}
  className={`${dropdownBtn} flex items-center justify-between`}
>
  <span className="truncate max-w-[85%]">
    {selectedParameter
      ? parameterDisplayNames[selectedParameter] || selectedParameter
      : "Select Parameter"}
  </span>

  <span className="flex-shrink-0 ml-2">
    {showParameters ? <IoChevronUp size={20} /> : <HiMiniChevronDown size={25} />}
  </span>
</button>

            {showParameters && (
              <div className={dropdownMenu}>
                {parameters.map((param) => (
                  <label
                    key={param}
                    title={parameterDisplayNames[param] || param}
                    className="block px-4 py-2 truncate dark:hover:bg-gray-600 hover:bg-gray-100"
                  >
                    <input
                      type="radio"
                      name="parameter"
                      value={param}
                      checked={selectedParameter === param}
                      onChange={(e) => {
                        setSelectedParameter(e.target.value);
                        setShowParameters(false);
                      }}
                      className="mr-2"
                    />
                    <span className="inline-block max-w-[80%] truncate align-middle">{parameterDisplayNames[param] || param}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chart + Export */}
        <div className="flex-1 w-full">
          <div className="relative">
            <div className="flex-1 w-full">
              {showPdfBtn && (
                <div className="relative flex justify-end gap-2 mb-2">
                  {/* Images */}
                  <div className="relative">
                    <button
                      onClick={() => setShowImageMenu((s) => !s)}
                      title="Export as image"
                      aria-label="Export as image"
                      className="p-2 rounded-full bg-[#f3f0f0] hover:bg-[#d9d9d9] dark:bg-gray-700 dark:hover:bg-gray-600 shadow cursor-pointer"
                    >
                      <FaImage className="w-5 h-5" />
                    </button>
                    {showImageMenu && (
                      <div className="absolute right-0 z-30 mt-2 bg-white border rounded shadow w-28 dark:bg-gray-800 dark:border-gray-700">
                        <button
                          onClick={() => exportChartImage("png")}
                          className="w-full px-3 py-2 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          PNG
                        </button>
                        <button
                          onClick={() => exportChartImage("jpg")}
                          className="w-full px-3 py-2 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          JPG
                        </button>
                        <button
                          onClick={() => exportChartImage("svg")}
                          className="w-full px-3 py-2 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
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
                    className="p-2 rounded-full bg-[#f3f0f0] hover:bg-[#d9d9d9] dark:bg-gray-700 dark:hover:bg-gray-600 shadow cursor-pointer"
                  >
                    <FaFilePdf className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </button>

                  {/* Excel */}
                  <button
                    onClick={exportToExcel}
                    title="Export as Excel"
                    aria-label="Export as Excel"
                    className="p-2 rounded-full bg-[#f3f0f0] hover:bg-[#d9d9d9] dark:bg-gray-700 dark:hover:bg-gray-600 shadow cursor-pointer"
                  >
                    <FaFileExcel className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </button>
                </div>
              )}
            </div>

            <div className="relative w-full" style={{ height: "57vh" }}>
              <div ref={chartElRef} id="chartDiv" className="w-full h-full bg-white rounded-md dark:bg-gray-800" />
              {!isReady && !loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-gray-800/90">
                  <Image
                    src="/trend_icon.svg"
                    alt="alt-img"
                    width={800}
                    height={400}
                    className="h-[40vh] w-[80vh]"
                  />

                  <p className="mt-4 font-bold">Select Desired Filters to view Trend!</p>
                </div>
              )}
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80">
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

"use client";
import React, { useEffect, useRef, useState } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import axios from "axios";
import { useTheme } from "next-themes";
import { MdOutlineFullscreen, MdOutlineFullscreenExit, MdKeyboardArrowDown } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";

am4core.useTheme(am4themes_animated);

// Format utilities
const formatDate = (date) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-PK", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Karachi",
  }).format(date);
};

const formatRange = (start, end) => {
  if (!start && !end) return "Select date range";
  if (start && !end) return `${formatDate(start)} - ...`;
  if (!start && end) return `... - ${formatDate(end)}`;
};

const GeneralOperator = ({
  title,
  chartId,
  yAxisTitleLeft = "",
  yAxisTitleRight = "",
  seriesConfig,
  apiUrl,
  stackBars = false,
  showResolutionToggle = false,
  defaultResolution = "hour",
  onResolutionChange,
  showMarkers = false, // New prop for 'M' markers on chart
  extraPayload = {}, // Optional extra fields for API payload
  infoContent = "", // New prop for modal info content
  queryParams, // New prop for external query params string
}) => {
  const [data, setData] = useState([]);
  const today = new Date();
  const [resolution, setResolution] = useState(defaultResolution || "hour");
  const [dateRange, setDateRange] = useState([today, today]);
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateOption, setDateOption] = useState("Today");
  const [loading, setLoading] = useState(false);
  const [selectedStats, setSelectedStats] = useState([]);
  const [showStatsDropdown, setShowStatsDropdown] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false); // New state for info modal
  const calendarRef = useRef(null);
  const statsDropdownRef = useRef(null);
  const [startDate, endDate] = dateRange;
  const statLabels = { min: 'Min', max: 'Max', avg: 'Average' };

  // Handle date option changes
  useEffect(() => {
    let newRange = [null, null];
    const today = new Date();
    switch (dateOption) {
      case "Today":
        newRange = [today, today];
        break;
      case "Yesterday": {
        const yest = new Date(today);
        yest.setDate(today.getDate() - 1);
        newRange = [yest, yest];
        break;
      }
      case "This Week": {
        const first = new Date(today);
        first.setDate(today.getDate() - today.getDay());
        newRange = [first, today];
        break;
      }
      case "This Month": {
        const first = new Date(today.getFullYear(), today.getMonth(), 1);
        newRange = [first, today];
        break;
      }
      case "This Year": {
        const first = new Date(today.getFullYear(), 0, 1);
        newRange = [first, today];
        break;
      }
      case "Custom":
        // Don't change dateRange, let user pick
        return;
      default:
        newRange = [today, today];
    }
    setDateRange(newRange);
  }, [dateOption]);

  // Build query string from extraPayload (same as MetricCard)
  const buildQueryString = (payload) => {
    const params = new URLSearchParams();
    Object.entries(payload).forEach(([key, val]) => {
      if (val !== null && val !== undefined && val !== '') {
        params.append(key, val);
      }
    });
    return params.toString();
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = `${apiUrl}`;
      let queryStr = '';

      // Prioritize queryParams if provided
      if (queryParams) {
        queryStr = queryParams;
      } else {
        // Build from extraPayload (mode, start, end, etc.)
        queryStr = buildQueryString(extraPayload);
      }

      // Append resolution if relevant (e.g., for live)
      if (extraPayload.mode === 'live' && resolution) {
        const resParams = new URLSearchParams({ interval: resolution });
        queryStr += queryStr ? `&${resParams.toString()}` : `?${resParams.toString()}`;
      }

      if (queryStr) {
        url += `?${queryStr}`;
      }

      console.log('GeneralOperator API URL:', url); // Debug

      const res = await axios.get(url);
      let raw = res.data || []; // Assume direct array or { data: [...] }

      // If nested, extract (adjust based on API)
      if (res.data.data && res.data.data.rawdata) {
        raw = res.data.data.rawdata;
      } else if (Array.isArray(raw)) {
        // Already array
      } else {
        raw = []; // Fallback
      }

      // Format for AmCharts: { time: string, ...fields }
      const formatted = raw.map((item) => ({
        time: item.timestamp || item.label || item.date || new Date(item.time || Date.now()).toISOString().split('T')[0], // Adjust key as per API
        ...item
      }));

      setData(formatted);
    } catch (err) {
      console.error("Chart API error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch useEffect: Runs on extraPayload or queryParams change
  useEffect(() => {
    if (!apiUrl) return;
    fetchData();
  }, [extraPayload, queryParams, resolution, apiUrl]); // Removed local dateRange deps since using external payload

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statsDropdownRef.current && !statsDropdownRef.current.contains(event.target)) {
        setShowStatsDropdown(false);
      }
    };
    if (showStatsDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStatsDropdown]);

  // Calculate min, max, average for each series
  const calculateStats = () => {
    return seriesConfig.map(series => {
      const values = data
        .map(item => item[series.valueField])
        .filter(value => typeof value === 'number' && !isNaN(value));
      const min = values.length > 0 ? Math.min(...values) : 'N/A';
      const max = values.length > 0 ? Math.max(...values) : 'N/A';
      const avg = values.length > 0
        ? (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(2)
        : 'N/A';
      return {
        name: series.name,
        min,
        max,
        avg
      };
    });
  };

  const toggleStat = (statType) => {
    setSelectedStats(prev =>
      prev.includes(statType)
        ? prev.filter(s => s !== statType)
        : [...prev, statType]
    );
  };

  useEffect(() => {
    let chart = am4core.create(chartId, am4charts.XYChart);
    chart.data = data;

    const isDark = theme === "dark";

    // X Axis
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "time";
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;
    categoryAxis.renderer.labels.template.fontSize = 12;
    categoryAxis.renderer.labels.template.fill = am4core.color(isDark ? "#fff" : "#000");
    categoryAxis.renderer.grid.template.stroke = am4core.color("#ccc");
    categoryAxis.renderer.grid.template.strokeOpacity = 0.6;
    categoryAxis.renderer.grid.template.strokeDasharray = "3,3";

    // Y Axis Left
    const valueAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis1.title.text = yAxisTitleLeft || "";
    valueAxis1.title.fontSize = 12;
    valueAxis1.title.fill = am4core.color("#7a8085ff");
    valueAxis1.renderer.labels.template.fontSize = 12;
    valueAxis1.renderer.labels.template.fill = am4core.color("#666");
    valueAxis1.renderer.grid.template.stroke = am4core.color("#ccc");
    valueAxis1.renderer.grid.template.strokeOpacity = 0.6;
    valueAxis1.renderer.grid.template.strokeDasharray = "3,3";
    valueAxis1.renderer.ticks.template.stroke = am4core.color("#666");
    valueAxis1.renderer.axisFills.template.fill = am4core.color("#666");
    valueAxis1.renderer.line.stroke = am4core.color("#666");
    valueAxis1.renderer.labels.template.fill = am4core.color(isDark ? "#fff" : "#000");
    valueAxis1.extraMax = 0.1;

    // Y Axis Right
    const valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis2.renderer.opposite = true;
    valueAxis2.title.text = yAxisTitleRight || "";
    valueAxis2.title.fontSize = 12;
    valueAxis2.title.fill = am4core.color("#7a8085ff");
    valueAxis2.renderer.labels.template.fontSize = 12;
    valueAxis2.renderer.labels.template.fill = am4core.color("#666");
    valueAxis2.renderer.grid.template.disabled = true;
    valueAxis2.renderer.line.stroke = am4core.color("#666");
    valueAxis2.extraMax = 0.1;
    valueAxis2.renderer.labels.template.fill = am4core.color(isDark ? "#fff" : "#000");

    seriesConfig.forEach((seriesItem) => {
      const series =
        seriesItem.type === "line"
          ? chart.series.push(new am4charts.LineSeries())
          : chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = seriesItem.valueField;
      series.dataFields.categoryX = "time";
      series.name = seriesItem.name;
      series.tooltipText = `{name}: {valueY}`;
      series.tooltip.label.fontSize = 12;
      series.stroke = am4core.color(seriesItem.color);
      series.fill = am4core.color(seriesItem.color);
      if (seriesItem.yAxis === "right") {
        series.yAxis = chart.yAxes.values[1];
      } else {
        series.yAxis = chart.yAxes.values[0];
      }
      if (seriesItem.type === "line") {
        series.strokeWidth = 2; // Slightly thicker for visibility in dashboard
        series.strokeDasharray = "0";
      } else {
        if (stackBars) series.stacked = true;
        series.columns.template.width = am4core.percent(70);
      }

      // Add 'M' markers if enabled (e.g., for specific points like max/min)
      if (showMarkers && seriesItem.markerPoints) {
        // Assuming markerPoints is an array of data indices or conditions
        // For simplicity, add a sample bullet; customize based on data
        const bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.radius = 6;
        bullet.circle.fill = am4core.color("#00FF00"); // Green 'M' marker
        bullet.label.text = "M";
        bullet.label.fill = am4core.color("#fff");
        bullet.label.fontSize = 10;
        // In real use, use data validator to show only on specific points
      }
    });

    chart.legend = new am4charts.Legend();
    chart.legend.itemContainers.template.paddingTop = 2;
    chart.legend.itemContainers.template.paddingBottom = 2;
    chart.legend.position = "bottom";
    chart.legend.marginTop = 0;
    chart.legend.fontSize = 10;
    chart.legend.itemContainers.template.height = 18;
    chart.legend.markers.template.width = 10;
    chart.legend.markers.template.height = 10;
    chart.legend.labels.template.maxWidth = 260;
    chart.legend.labels.template.fill = am4core.color(isDark ? "#fff" : "#000");

    chart.cursor = new am4charts.XYCursor();
    // if (!chart.scrollbarX) {
    //   chart.scrollbarX = new am4charts.XYChartScrollbar();
    // }
    // const sb = chart.scrollbarX;
    // const gripColor = am4core.color(isDark ? "#cbd5e1" : "#9ca3af");
    // if (chart.series.length > 0 && sb.series.length === 0) {
    //   const src = chart.series.getIndex(0);
    //   const preview = sb.series.push(new am4charts.LineSeries());
    //   preview.dataFields.categoryX = src.dataFields.categoryX;
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
    // {
    //   const hoverBg = sb.thumb.background.states.getKey("hover") || sb.thumb.background.states.create("hover");
    //   hoverBg.properties.fillOpacity = 1;
    //   const downBg = sb.thumb.background.states.getKey("down") || sb.thumb.background.states.create("down");
    //   downBg.properties.fillOpacity = 1;
    // }

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
    //   line.x1 = 6; line.x2 = 6;
    //   line.y1 = 2; line.y2 = 14;
    //   line.stroke = gripColor;
    //   line.strokeWidth = 1.5;
    //   line.pixelPerfect = true;
    //   const up = c.createChild(am4core.Triangle);
    //   up.width = 6; up.height = 4;
    //   up.fill = gripColor;
    //   up.strokeOpacity = 0;
    //   up.x = 6; up.y = 4;
    //   up.horizontalCenter = "middle";
    //   up.verticalCenter = "middle";
    //   const down = c.createChild(am4core.Triangle);
    //   down.width = 6; down.height = 4;
    //   down.fill = gripColor;
    //   down.strokeOpacity = 0;
    //   down.rotation = 180;
    //   down.x = 6; down.y = 12;
    //   down.horizontalCenter = "middle";
    //   down.verticalCenter = "middle";
    //   const s = grip.states.create("hover");
    //   s.properties.scale = 1.08;
    // }
    // applyChevronGrip(sb.startGrip);
    // applyChevronGrip(sb.endGrip);

    if (!chart.cursor) chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "zoomX";
    chart.mouseWheelBehavior = "zoomX";
    chart.logo.disabled = true;

    // Add stat lines only in expanded mode
    if (isExpanded && selectedStats.length > 0) {
      const stats = calculateStats();
      seriesConfig.forEach((seriesItem, index) => {
        const stat = stats[index];
        if (!stat) return;
        selectedStats.forEach(statType => {
          let value, labelText, lineColor;
          if (statType === "min") {
            if (stat.min === 'N/A') return;
            value = stat.min;
            labelText = `${seriesItem.name} Min`;
            lineColor = "#FF0009"; // red
          } else if (statType === "max") {
            if (stat.max === 'N/A') return;
            value = stat.max;
            labelText = `${seriesItem.name} Max`;
            lineColor = "#00FF14"; // green
          } else if (statType === "avg") {
            if (stat.avg === 'N/A') return;
            value = parseFloat(stat.avg);
            if (isNaN(value)) return;
            labelText = `${seriesItem.name} Avg`;
            lineColor = "#efa2ec"; // blue
          } else {
            return;
          }
          const axisIndex = seriesItem.yAxis === "right" ? 1 : 0;
          const axis = chart.yAxes.getIndex(axisIndex);
          const range = axis.axisRanges.create();
          range.value = value;
          range.label.text = labelText;
          range.label.fontSize = 15;
          range.label.fill = am4core.color(lineColor);
          range.grid.stroke = am4core.color(lineColor);
          range.grid.strokeWidth = 2;
          range.label.horizontalCenter = "left";
          range.label.inside = false;
        });
      });
    }

    return () => {
      chart.dispose();
    };
  }, [data, seriesConfig, chartId, theme, stackBars, yAxisTitleLeft, yAxisTitleRight, isExpanded, selectedStats, showMarkers]);

  return (
    <div
      className={`${
              isExpanded
                ? "fixed inset-0 z-50 p-5 overflow-auto w-full h-screen custom-scrollbar flex flex-col"
                : "relative px-2 py-2 md:p-3 h-[20rem]"
            }  dark:border-[#333] bg-white dark:bg-[#333] rounded-md shadow-xl border-2 border-gray-200`}
    >
      {/* HEADER ROW */}
      <div className="flex !pb-1 flex-wrap items-center justify-between p-0 border-gray-300 bg-white dark:bg-[#333] rounded-t-md">
        <span className="text-[15px] font-semibold uppercase text-[#4F5562] dark:text-white font-raleway font-600">
          {title}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {dateOption === "Custom" && (
            <div className="relative flex items-center gap-2">
              <button
                type="button"
                className="p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setShowCalendar(v => !v)}
                tabIndex={0}
              >
                <CalendarDaysIcon className="w-5 h-5 text-gray-600 dark:text-white" />
              </button>
              {showCalendar && (
                <div
                  ref={calendarRef}
                  className="absolute right-0 top-8 mt-1 bg-white p-2 rounded shadow z-30 min-w-[250px]"
                >
                  <DatePicker
                    selectsRange
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => {
                      setDateRange(update);
                      if (update[0] && update[1]) {
                        setShowCalendar(false);
                      }
                    }}
                    isClearable
                    inline
                  />
                </div>
              )}
            </div>
          )}
          {/* <select
            className="text-xs px-2 py-1 border rounded bg-white dark:bg-gray-700 dark:text-white min-w-[110px]"
            value={dateOption}
            onChange={e => {
              setDateOption(e.target.value);
              if (e.target.value !== "Custom") setShowCalendar(false);
              else setShowCalendar(true);
            }}
          >
            <option value="Today">Today</option>
            <option value="Yesterday">Yesterday</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="This Year">This Year</option>
            <option value="Custom">Custom</option>
          </select> */}
          {/* Uncomment for stats dropdown if needed */}
          {/* {isExpanded && (
            <div className="relative" ref={statsDropdownRef}>
              <button
                className="text-xs px-2 py-1 border rounded bg-white dark:bg-gray-700 dark:text-white min-w-[90px] hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-between"
                onClick={() => setShowStatsDropdown(!showStatsDropdown)}
              >
                <span>{selectedStats.length === 0 ? 'None' : selectedStats.map(s => statLabels[s]).join(', ')}</span>
                <MdKeyboardArrowDown className="w-3 h-3 ml-1" />
              </button>
              {showStatsDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 border rounded shadow z-10 min-w-[90px]">
                  <label className="flex items-center gap-1 px-2 py-1 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                    <input
                      type="checkbox"
                      checked={selectedStats.includes("min")}
                      onChange={() => toggleStat("min")}
                      className="rounded"
                    />
                    Min
                  </label>
                  <label className="flex items-center gap-1 px-2 py-1 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                    <input
                      type="checkbox"
                      checked={selectedStats.includes("max")}
                      onChange={() => toggleStat("max")}
                      className="rounded"
                    />
                    Max
                  </label>
                  <label className="flex items-center gap-1 px-2 py-1 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                    <input
                      type="checkbox"
                      checked={selectedStats.includes("avg")}
                      onChange={() => toggleStat("avg")}
                      className="rounded"
                    />
                    Average
                  </label>
                </div>
              )}
            </div>
          )} */}
          <button onClick={() => setIsExpanded(!isExpanded)} className="relative bottom-[0px] cursor-pointer ">
            {isExpanded ? (
              <MdOutlineFullscreenExit className="text-gray-600 h-7 w-7 dark:text-white" />
            ) : (
              <MdOutlineFullscreen className="text-gray-600 h-7 w-7 dark:text-white" />
            )}
          </button>
          <button 
            onClick={() => setShowInfoModal(true)} 
            className="relative bottom-[0px] cursor-pointer"
          >
            <FaInfoCircle className="w-5 h-5 text-gray-600 dark:text-[#a5a5a5]" />
          </button>
        </div>
      </div>

      {/* RESOLUTION TOGGLE ROW */}
      {showResolutionToggle && (
        <div className="flex justify-end px-2 mt-1 bg-white dark:bg-gray-800">
          <div className="inline-flex overflow-hidden border border-gray-300 rounded-md dark:border-gray-600">
            {["hour", "15min"].map((r) => {
              const active = resolution === r;
              const label = r === "15min" ? "15-min" : "Hourly";
              return (
                <button
                  key={r}
                  disabled={loading}
                  onClick={() => {
                    setResolution(r);
                    onResolutionChange?.(r);
                  }}
                  className={[
                    "px-2.5 py-1.5 text-xs font-medium transition cursor-pointer",
                    active
                      ? "bg-[#1F5897] text-white"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700",
                    "disabled:opacity-60 disabled:cursor-not-allowed"
                  ].join(" ")}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* CHART AREA */}
      <div className="relative flex-1 overflow-hidden">
        <div className={isExpanded ? "flex h-full gap-4" : "h-full"}>
          <div className={isExpanded ? "relative flex-1" : "relative h-[16.7rem] w-full"}>
            <div
              id={chartId}
              className="absolute inset-0 w-full h-full"
            />
            {loading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white dark:bg-[#333333]">
                <div className="loader" />
              </div>
            )}
          </div>
          {/* {isExpanded && !loading && data.length > 0 && (
            <div className="w-1/3 h-full p-2 overflow-y-auto mt-45">
              <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm dark:border-gray-700">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs font-medium text-gray-700 uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-300">
                    <tr>
                      <th className="px-4 py-3 font-semibold tracking-wider">Series</th>
                      <th className="px-4 py-3 font-semibold tracking-wider">Min</th>
                      <th className="px-4 py-3 font-semibold tracking-wider">Max</th>
                      <th className="px-4 py-3 font-semibold tracking-wider">Average</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                    {calculateStats().map((stat, index) => {
                      const series = seriesConfig.find(s => s.name === stat.name);
                      const seriesColor = series ? series.color : '#000000';
                      const formatValue = (val) => typeof val === 'number' ? val.toFixed(2) : val;
                      return (
                        <tr
                          key={index}
                          className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <span
                                className="inline-block w-3 h-3 mr-2.5 rounded shadow-sm"
                                style={{ backgroundColor: seriesColor }}
                              ></span>
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                {stat.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono text-black dark:text-white">
                            {formatValue(stat.min)}
                          </td>
                          <td className="px-4 py-3 font-mono text-black dark:text-white">
                            {formatValue(stat.max)}
                          </td>
                          <td className="px-4 py-3 font-mono text-black dark:text-white">
                            {stat.avg}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )} */}
        </div>
      </div>

      {/* INFO MODAL */}
      {showInfoModal && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center  "
          onClick={() => setShowInfoModal(false)}
        >
          <div 
            className="bg-white dark:bg-[#353537] rounded-lg shadow-xl max-w-md w-full mx-4 p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Chart Information
              </h3>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white"
              >
                <MdOutlineFullscreenExit className="w-6 h-6" />
              </button>
            </div>
            <div className="overflow-y-auto text-sm text-gray-700 dark:text-gray-300 max-h-64">
              {infoContent || (
                <p>
                  This chart displays {title.toLowerCase()}. It includes series for various metrics over the selected time range.
                  Use the fullscreen icon to expand the view and access detailed statistics.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralOperator;
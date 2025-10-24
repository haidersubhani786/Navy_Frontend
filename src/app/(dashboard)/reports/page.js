"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



const reportData = [
  {
    date: '2025-10-21',
    duration: '3:00-3:30',
    runHours: '30 mins (0.5 hr)',
    fuelConsumed: 40,
    production: 40
  },
  {
    date: '2025-10-21',
    duration: '5:15-5:50',
    runHours: '40 mins (0.6 hr)',
    fuelConsumed: 55,
    production: 55
  },
  {
    date: '2025-10-21',
    duration: '6:15-7:50',
    runHours: '40 mins (0.6 hr)',
    fuelConsumed: 55,
    production: 55
  },
  {
    date: '2025-10-22',
    duration: '3:00-3:30',
    runHours: '30 mins (0.5 hr)',
    fuelConsumed: 40,
    production: 40
  },

];

export default function ReportPage() {
  const [dateRange, setDateRange] = useState([null, null]);
  const [fuelCost, setFuelCost] = useState(240);
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState([]);

  const startDate = dateRange[0];
  const endDate = dateRange[1];

  // Function to generate table data
  const generateTable = () => {
    if (!startDate || !endDate || !fuelCost) {
      alert('Please select dates and enter fuel cost.');
      return;
    }

    if (startDate > endDate) {
      alert('Start date cannot be after end date.');
      return;
    }

    const filteredData = reportData.filter(row => {
      const rowDate = new Date(row.date);
      return rowDate >= startDate && rowDate <= endDate;
    });

    const processedData = filteredData.map(row => {
      const costPKR = row.fuelConsumed * fuelCost;
      const costPerUnit = Math.round(costPKR / row.production);
      const totalCost = costPKR;

      // Parse run hours for total calculation
      const hoursMatch = row.runHours.match(/(\d+(?:\.\d+)?)\s*hr/);
      const hours = hoursMatch ? parseFloat(hoursMatch[1]) : 0;

      return {
        ...row,
        costPKR: Math.round(costPKR),
        costPerUnit,
        totalCost: Math.round(totalCost),
        hours
      };
    });

    let totalRunHours = processedData.reduce((sum, row) => sum + row.hours, 0);
    let totalFuel = processedData.reduce((sum, row) => sum + row.fuelConsumed, 0);
    let totalProduction = processedData.reduce((sum, row) => sum + row.production, 0);
    let totalCostPKR = processedData.reduce((sum, row) => sum + row.costPKR, 0);

    setTableData([
      ...processedData,
      {
        isTotal: true,
        date: 'TOTAL',
        runHours: `${Math.round(totalRunHours * 60)} mins (${totalRunHours.toFixed(1)} hrs)`,
        fuelConsumed: totalFuel,
        production: totalProduction,
        costPKR: totalCostPKR,
        totalCost: totalCostPKR
      }
    ]);

    setShowTable(true);
  };

  // Auto-generate on changes (optional, with debounce via useEffect)
  useEffect(() => {
    if (startDate && endDate && fuelCost) {
      const timeoutId = setTimeout(() => {
        generateTable();
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setShowTable(false);
    }
  }, [startDate, endDate, fuelCost]);

  return (
    <div className="p-6 text-white bg-[#1e1e1e]">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <h1 className="text-3xl font-bold">Report</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-xs text-gray-300">
            <span className="text-gray-400">Interval:</span>
            <div className="relative">
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                  setDateRange(update);
                }}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select date range"
                className="w-48 px-2 py-1 text-sm text-white bg-gray-800 border border-gray-700 rounded focus:outline-none"
                calendarClassName="bg-gray-800 text-white"
                dayClassName={() => "text-white hover:bg-gray-700"}
                wrapperClassName="date-range-wrapper"
              />
              <FaCalendarAlt className="absolute text-gray-400 transform -translate-y-1/2 pointer-events-none right-2 top-1/2" />
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-300">
            <span className="text-gray-400">Fuel Cost/Ltr:</span>
            <input
              type="number"
              value={fuelCost}
              onChange={(e) => setFuelCost(parseFloat(e.target.value) || 0)}
              className="w-20 px-2 py-1 text-sm text-white bg-gray-800 border border-gray-700 rounded focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Content: Image or Table */}
      <div className="overflow-auto bg-gray-800shadow-lg">
        {!showTable ? (
          <div className="flex items-center justify-center bg-[#1e1e1e] h-130">
            <Image 
              src="/trend_icon.svg"
              alt="Report Preview"
              width={320}
              height={240}
              className="object-contain rounded"
              priority={false}
              placeholder="empty" 
              onError={(e) => {
                console.error('Image failed to load');
              }}
            />
          </div>
        ) : (
          // Dynamic Table
          <div className="w-full overflow-auto">
            <table className="min-w-full text-sm text-gray-300">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-700 bg-gray-800/70">
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-left">Duration</th>
                  <th className="px-3 py-2 text-left">Run Hours (mins/hrs)</th>
                  <th className="px-3 py-2 text-left">Fuel Consumed (Ltr)</th>
                  <th className="px-3 py-2 text-left">Production (kWh)</th>
                  <th className="px-3 py-2 text-left">Cost (PKR)</th>
                  <th className="px-3 py-2 text-left">Cost/Unit</th>
                  <th className="px-3 py-2 text-left">Total Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {tableData.map((row, index) => (
                  <tr key={index} className={row.isTotal ? 'bg-gray-700 font-semibold text-gray-100' : 'bg-gray-800'}>
                    <td className="px-3 py-2 align-top">{row.isTotal ? row.date : row.date.split('-').reverse().join('-')}</td>
                    <td className="px-3 py-2 align-top">{row.duration || ''}</td>
                    <td className="px-3 py-2 align-top">{row.runHours}</td>
                    <td className="px-3 py-2 align-top">{row.fuelConsumed} Ltrs</td>
                    <td className="px-3 py-2 align-top">{row.production} kWh</td>
                    <td className="px-3 py-2 align-top">{row.costPKR || ''}</td>
                    <td className="px-3 py-2 align-top">{row.costPerUnit || ''}</td>
                    <td className="px-3 py-2 align-top">{row.totalCost || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
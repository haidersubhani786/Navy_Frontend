// "use client";
// import React from "react";
// import MetricCard from "../metricCard";
// import GeneralOperator from "@/components/OperatorDashboard/GeneralOperator"; 

// const ThermalHealth = () => {
//   const thermalPerformanceConfig = [
//     { name: 'Coolant Temperature', valueField: 'coolantTemp', color: '#3B82F6', type: 'line' },
//     { name: 'Oil Temperature', valueField: 'oilTemp', color: '#a14389', type: 'line' },
//   ];

//   const combustionAirEffectivenessConfig = [
//     { name: 'Intake_Manifold_Temperature', valueField: 'intakeTemp', color: '#10B981', type: 'line' },
//     { name: 'Boost_Pressure', valueField: 'boostPressure', color: '#8B5CF6', type: 'line' },
//   ];

//   const coolingSystemEfficiencyConfig = [
//     { name: 'Cooling Efficiency', valueField: 'coolingEfficiency', color: '#3B82F6', type: 'line' },
//     { name: 'Load Factor', valueField: 'loadFactor', color: '#F59E0B', type: 'line' },
//     { name: 'Pump Speed', valueField: 'pumpSpeed', color: '#EF4444', type: 'line' },
//     { name: 'Fan Speed', valueField: 'fanSpeed', color: '#10B981', type: 'line' },
//   ];

//   const thermalStressAlertConfig = [
//     { name: 'Stress Level', valueField: 'stressLevel', color: '#8B5CF6', type: 'line' },
//     { name: 'Alert Threshold', valueField: 'alertThreshold', color: '#EF4444', type: 'line', yAxis: 'right' },
//   ];

//   const coolingMarginAdequacyConfig = [
//     { name: 'Cooling Margin', valueField: 'coolingMargin', color: '#06B6D4', type: 'line' },
//     { name: 'Adequacy Index', valueField: 'adequacyIndex', color: '#10B981', type: 'line' },
//     { name: 'Margin Alert', valueField: 'marginAlert', color: '#F59E0B', type: 'line' },
//   ];

//   const baseApiUrl = "/api/generator-data";

//   return (
//     <>
      
//       <div className="grid grid-cols-1 gap-4 mt-6 operational-kpis md:grid-cols-2 lg:grid-cols-2">
//         {/* Thermal Performance */}
//         <GeneralOperator
//           title="Thermal Performance"
//           chartId="thermal-performance"
//           seriesConfig={thermalPerformanceConfig}
//           apiUrl={`${baseApiUrl}/thermal-performance`}
//           yAxisTitleLeft="Coolant Temperature"
//           yAxisTitleRight="Oil Temperature"
//           showMarkers={true}
//           extraPayload={{ type: 'generator' }}
//           infoContent="Displays thermal efficiency alongside exhaust and coolant temperatures over time."
//         />

//         {/* Combustion Air Effectiveness */}
//         <GeneralOperator
//           title="Combustion Air Effectiveness"
//           chartId="combustion-air"
//           seriesConfig={combustionAirEffectivenessConfig}
//           apiUrl={`${baseApiUrl}/combustion-air`}
//           yAxisTitleLeft="Intake_Manifold_Temperature"
//           yAxisTitleRight="Boost_Pressure"
//           extraPayload={{ type: 'generator' }}
//           infoContent="Tracks air flow, pressure, and temperature for combustion optimization."
//         />

//         {/* Cooling System Efficiency vs Load */}
//         <GeneralOperator
//           title="Cooling System Efficiency vs Load"
//           chartId="cooling-efficiency-load"
//           seriesConfig={coolingSystemEfficiencyConfig}
//           apiUrl={`${baseApiUrl}/cooling-efficiency`}
//           yAxisTitleLeft="Efficiency % / Load"
//           extraPayload={{ type: 'generator' }}
//           infoContent="Compares cooling efficiency with load, pump, and fan speeds."
//         />

//         {/* Thermal Stress Alert */}
//         <GeneralOperator
//           title="Thermal Stress Alert"
//           chartId="thermal-stress-alert"
//           seriesConfig={thermalStressAlertConfig}
//           apiUrl={`${baseApiUrl}/thermal-stress`}
//           yAxisTitleLeft="Stress Level"
//           yAxisTitleRight="Threshold"
//           extraPayload={{ type: 'generator' }}
//           infoContent="Monitors thermal stress with alert thresholds for proactive maintenance."
//         />

//         {/* Cooling Margin Adequacy */}
//         <GeneralOperator
//           title="Cooling Margin Adequacy"
//           chartId="cooling-margin"
//           seriesConfig={coolingMarginAdequacyConfig}
//           apiUrl={`${baseApiUrl}/cooling-margin`}
//           yAxisTitleLeft="Margin % / Index"
//           extraPayload={{ type: 'generator' }}
//           infoContent="Evaluates cooling margin and adequacy to prevent overheating."
//         />
//       </div>
//     </>
//   );
// };

// export default ThermalHealth;


"use client";
import React from "react";
import MetricCard from "../metricCard";
import GeneralOperator from "@/components/OperatorDashboard/GeneralOperator"; 

const ThermalHealth = ({ view = "live", startDate, endDate, isRange }) => {
  const thermalPerformanceConfig = [
    { name: 'Coolant Temperature', valueField: 'Coolant_Temperature', color: '#3B82F6', type: 'line' },
    { name: 'Oil Temperature', valueField: 'Oil_Temperature', color: '#a14389', type: 'line', yAxis: 'right' },
  ];

  const combustionAirEffectivenessConfig = [
    { name: 'Intake_Manifold_Temperature', valueField: 'Intake_Manifold3_Temperature', color: '#10B981', type: 'line' },
    { name: 'Boost_Pressure', valueField: 'Boost_Pressure', color: '#F59E0B', type: 'line' },
  ];

  const coolingSystemEfficiencyConfig = [
    { name: 'Line to line Voltage', valueField: 'Genset_LL_Avg_Voltage', color: '#EF4444', type: 'line' },
    { name: 'Voltage Imbalance (%)', valueField: 'voltageImbalance', color: '#10B981', type: 'line', yAxis: 'right' },
  ];

  const thermalStressAlertConfig = [
    { name: 'Load (%)', valueField: 'LoadPercent', color: '#8B5CF6', type: 'line' },
    { name: 'Power Factor', valueField: 'Genset_Total_Power_Factor_calculated', color: '#EF4444', type: 'line', yAxis: 'right' },
  ];

  const coolingMarginAdequacyConfig = [
    { name: 'Cooling Margin', valueField: 'Cooling_Margin', color: '#06B6D4', type: 'line' },
  ];

  const baseApiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/thermal-health`;
  const getCommonPayload = () => {
    const payload = { 
      type: 'generator', 
      mode: view 
    };
    
    if (view === "live") {
      payload.interval = 'hour'; 
    }
    
    if (view === "historic") {
      const formattedStart = startDate ? new Date(startDate + 'T00:00:00.000Z').toISOString() : null;
      const formattedEnd = endDate ? new Date(endDate + 'T23:59:59.999Z').toISOString() : null;
      
      if (formattedStart && formattedEnd && new Date(formattedEnd) < new Date(formattedStart)) {
        payload.end = formattedStart; 
      } else {
        if (formattedStart) payload.start = formattedStart;
        if (formattedEnd) payload.end = formattedEnd;
      }
      
    }
    
    delete payload.fromDate;
    delete payload.toDate;
    if (view === "historic") delete payload.interval;
    
    return payload;
  };

  return (
    <>
      
      <div className="grid grid-cols-1 gap-4 mt-6 operational-kpis md:grid-cols-2 lg:grid-cols-2">
        {/* Thermal Performance */}
        <GeneralOperator
          title="Thermal Performance"
          chartId="thermal-performance"
          seriesConfig={thermalPerformanceConfig}
          apiUrl={`${baseApiUrl}/thermal-performance`}
          yAxisTitleLeft="Coolant Temperature"
          yAxisTitleRight="Oil Temperature"
          showMarkers={true}
          extraPayload={getCommonPayload()}
          infoContent="Displays thermal efficiency alongside exhaust and coolant temperatures over time."
        />

        {/* Combustion Air Effectiveness */}
        <GeneralOperator
          title="Combustion Air Effectiveness"
          chartId="combustion-air"
          seriesConfig={combustionAirEffectivenessConfig}
          apiUrl={`${baseApiUrl}/combustion-air`}
          yAxisTitleLeft="Intake_Manifold_Temperature"
          yAxisTitleRight="Boost_Pressure"
          extraPayload={getCommonPayload()}
          infoContent="Tracks air flow, pressure, and temperature for combustion optimization."
        />

        {/* Cooling System Efficiency vs Load */}
        <GeneralOperator
          title="Cooling System Efficiency vs Load"
          chartId="cooling-efficiency-load"
          seriesConfig={coolingSystemEfficiencyConfig}
          apiUrl={`${baseApiUrl}/cooling-efficiency`}
          yAxisTitleLeft="Coolant Temperature"
          yAxisTitleRight="Load (%)"
          extraPayload={getCommonPayload()}
          infoContent="Compares cooling efficiency with load, pump, and fan speeds."
        />

        {/* Thermal Stress Alert */}
        <GeneralOperator
          title="Thermal Stress Alert"
          chartId="thermal-stress-alert"
          seriesConfig={thermalStressAlertConfig}
          apiUrl={`${baseApiUrl}/thermal-stress`}
          yAxisTitleLeft="Thermal Stress"
          yAxisTitleRight="Oil Temperature_Safety Ratio"
          extraPayload={getCommonPayload()}
          infoContent="Monitors thermal stress with alert thresholds for proactive maintenance."
        />

        {/* Cooling Margin Adequacy */}
        <GeneralOperator
          title="Cooling Margin Adequacy"
          chartId="cooling-margin"
          seriesConfig={coolingMarginAdequacyConfig}
          apiUrl={`${baseApiUrl}/cooling-margin`}
          yAxisTitleLeft="Margin % / Index"
          extraPayload={getCommonPayload()}
          infoContent="Evaluates cooling margin and adequacy to prevent overheating."
        />
      </div>
    </>
  );
};

export default ThermalHealth;
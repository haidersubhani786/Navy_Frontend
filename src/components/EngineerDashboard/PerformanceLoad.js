// "use client";
// import React from "react";
// import GeneralOperator from "@/components/OperatorDashboard/GeneralOperator"; 

// const PerformanceLoad = () => {
//   const efficiencyUnderLoadConfig = [
//     { name: 'Load (%)', valueField: 'load', color: '#3B82F6', type: 'line' },
//     { name: 'Generator Efficiency', valueField: 'generatorEfficiency', color: '#A855F7', type: 'line' },
//   ];

//   const torqueResponseLoadConfig = [
//     { name: 'Load %', valueField: 'loadPercent', color: '#10B981', type: 'line' },
//     { name: 'Percent Engine Torque', valueField: 'percentEngineTorque', color: '#F59E0B', type: 'line' },
//   ];

//   const loadImpactSpeedConfig = [
//     { name: 'Load %', valueField: 'loadPercent', color: '#EF4444', type: 'line' },
//     { name: 'RPM Deviation', valueField: 'rpmDeviation', color: '#F59E0B', type: 'line' },
//   ];

//   const oscillationBehaviorConfig = [
//     { name: 'Load %', valueField: 'loadPercent', color: '#10B981', type: 'line' },
//     { name: 'Oscillation Index', valueField: 'oscillationIndex', color: '#3B82F6', type: 'line' },
//   ];

//   const fuelDemandLoadConfig = [
//     { name: 'Load %', valueField: 'loadPercent', color: '#10B981', type: 'line' },
//     { name: 'Fuel Consumed', valueField: 'fuelConsumed', color: '#A855F7', type: 'line' },
//   ];

//   const baseApiUrl = "/api/generator-data";

//   return (
//     <>
//       <div className="grid grid-cols-1 gap-4 mt-6 operational-kpis md:grid-cols-2 lg:grid-cols-2">
//         {/* Efficiency under Load */}
//         <GeneralOperator
//           title="Efficiency under Load"
//           chartId="efficiency-under-load"
//           seriesConfig={efficiencyUnderLoadConfig}
//           apiUrl={`${baseApiUrl}/efficiency-under-load`}
//           yAxisTitleLeft="Load"
//           yAxisTitleRight="Generator Efficiency"
//           showMarkers={true}
//           extraPayload={{ type: 'generator' }}
//           infoContent="Monitors generator efficiency variations in relation to load changes."
//         />

//         {/* Torque Response to Load */}
//         <GeneralOperator
//           title="Torque Response to Load"
//           chartId="torque-response-load"
//           seriesConfig={torqueResponseLoadConfig}
//           apiUrl={`${baseApiUrl}/torque-response-load`}
//           yAxisTitleLeft="Load %"
//           yAxisTitleRight="Percent Engine Torque"
//           extraPayload={{ type: 'generator' }}
//           infoContent="Analyzes engine torque response dynamics to fluctuating load conditions."
//         />

//         {/* Load Impact on Speed Stability */}
//         <GeneralOperator
//           title="Load Impact on Speed Stability"
//           chartId="load-impact-speed"
//           seriesConfig={loadImpactSpeedConfig}
//           apiUrl={`${baseApiUrl}/load-impact-speed`}
//           yAxisTitleLeft="Load %"
//           yAxisTitleRight="RPM Deviation"
//           extraPayload={{ type: 'generator' }}
//           infoContent="Evaluates how load affects engine speed stability and RPM deviations."
//         />

//         {/* Oscillation Behavior under Load */}
//         <GeneralOperator
//           title="Oscillation Behavior under Load"
//           chartId="oscillation-behavior"
//           seriesConfig={oscillationBehaviorConfig}
//           apiUrl={`${baseApiUrl}/oscillation-behavior`}
//           yAxisTitleLeft="Load %"
//           yAxisTitleRight="Oscillation Index"
//           extraPayload={{ type: 'generator' }}
//           infoContent="Tracks vibrational oscillations and their relation to load levels."
//         />

//         {/* Fuel Demand under Load */}
//         <GeneralOperator
//           title="Fuel Demand under Load"
//           chartId="fuel-demand-load"
//           seriesConfig={fuelDemandLoadConfig}
//           apiUrl={`${baseApiUrl}/fuel-demand-load`}
//           yAxisTitleLeft="Load %"
//           yAxisTitleRight="Fuel Consumed"
//           extraPayload={{ type: 'generator' }}
//           infoContent="Assesses fuel consumption demands as influenced by operational loads."
//         />
//       </div>
//     </>
//   );
// };

// export default PerformanceLoad;


"use client";
import React from "react";
import GeneralOperator from "@/components/OperatorDashboard/GeneralOperator"; 

const PerformanceLoad = ({ view = "live", startDate, endDate, isRange }) => {
  const efficiencyUnderLoadConfig = [
    { name: 'Load (%)', valueField: 'load_Percent', color: '#5A895C', type: 'line' }, // 3B82F6
    { name: 'Generator Efficiency', valueField: 'generatorEfficiency', color: '#CA49A7', type: 'line' }, // A855F7
  ];

  const torqueResponseLoadConfig = [
    { name: 'Load %', valueField: 'loadPercent', color: '#A9D5AA', type: 'line' }, // 10B981
    { name: 'Percent Engine Torque', valueField: 'Percent_Engine_Torque_or_Duty_Cycle', color: '#0475B0', type: 'line' }, // F59E0B
  ];

  const loadImpactSpeedConfig = [
    { name: 'Load %', valueField: 'Load_Percent', color: '#E75956', type: 'line' }, // EF4444
    { name: 'RPM Deviation', valueField: 'RPM_Stability_Index', color: '#828933', type: 'line', yAxis: 'right' }, // F59E0B
  ];

  const oscillationBehaviorConfig = [
    { name: 'Load %', valueField: 'Load_Percent', color: '#20B2AA', type: 'line' }, // 10B981
    { name: 'Oscillation Index', valueField: 'Oscillation_Index', color: '#E75956', type: 'line', yAxis: 'right' }, // 3B82F6
  ];

  const fuelDemandLoadConfig = [
    { name: 'Load %', valueField: 'Load_Percent', color: '#A9D5AA', type: 'line' }, // 10B981
    { name: 'Fuel Consumed', valueField: 'Fuel_Cumulative', color: '#0475B0', type: 'line', yAxis: 'right' }, // A855F7
  ];

  const baseApiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/performance-load`;
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
        <GeneralOperator
          title="Efficiency under Load"
          chartId="efficiency-under-load"
          seriesConfig={efficiencyUnderLoadConfig}
          apiUrl={`${baseApiUrl}/efficiency-under-load`}
          yAxisTitleLeft="Load"
          yAxisTitleRight="Generator Efficiency"
          showMarkers={true}
          extraPayload={getCommonPayload()}
          infoContent="Monitors generator efficiency variations in relation to load changes."
        />

        <GeneralOperator
          title="Torque Response to Load"
          chartId="torque-response-load"
          seriesConfig={torqueResponseLoadConfig}
          apiUrl={`${baseApiUrl}/torque-response-load`}
          yAxisTitleLeft="Load %"
          yAxisTitleRight="Percent Engine Torque"
          extraPayload={getCommonPayload()}
          infoContent="Analyzes engine torque response dynamics to fluctuating load conditions."
        />

        <GeneralOperator
          title="Load Impact on Speed Stability"
          chartId="load-impact-speed"
          seriesConfig={loadImpactSpeedConfig}
          apiUrl={`${baseApiUrl}/load-impact-speed`}
          yAxisTitleLeft="Load %"
          yAxisTitleRight="RPM Deviation"
          extraPayload={getCommonPayload()}
          infoContent="Evaluates how load affects engine speed stability and RPM deviations."
        />

        <GeneralOperator
          title="Oscillation Behavior under Load"
          chartId="oscillation-behavior"
          seriesConfig={oscillationBehaviorConfig}
          apiUrl={`${baseApiUrl}/oscillation-behavior`}
          yAxisTitleLeft="Load %"
          yAxisTitleRight="Oscillation Index"
          extraPayload={getCommonPayload()}
          infoContent="Tracks vibrational oscillations and their relation to load levels."
        />

        <GeneralOperator
          title="Fuel Demand under Load"
          chartId="fuel-demand-load"
          seriesConfig={fuelDemandLoadConfig}
          apiUrl={`${baseApiUrl}/fuel-demand-load`}
          yAxisTitleLeft="Load %"
          yAxisTitleRight="Fuel Consumed"
          extraPayload={getCommonPayload()}
          infoContent="Assesses fuel consumption demands as influenced by operational loads."
        />
      </div>
    </>
  );
};

export default PerformanceLoad;
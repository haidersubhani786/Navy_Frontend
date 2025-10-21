// "use client";
// import React from "react";
// import GeneralOperator from "@/components/OperatorDashboard/GeneralOperator"; 

// const LubricationPressure = () => {
//   const lubricationHealthConfig = [
//     { name: 'Oil Pressure', valueField: 'oilPressure', color: '#8B5CF6', type: 'line' },
//     { name: 'Oil Temperature', valueField: 'oilTemp', color: '#3B82F6', type: 'line' },
//   ];

//   const electricalStabilityConfig = [
//     { name: 'Lubrication Risk Index', valueField: 'lubricationRiskIndex', color: '#10B981', type: 'line' },
//   ];

//   const lubPressureResponseConfig = [
//     { name: 'Oil Pressure', valueField: 'oilPressure', color: '#F59E0B', type: 'line' },
//     { name: 'Engine Speed', valueField: 'engineSpeed', color: '#10B981', type: 'line' },
//   ];

//   const airFuelProfileConfig = [
//     { name: 'Boost Pressure', valueField: 'boostPressure', color: '#3B82F6', type: 'line' },
//     { name: 'Fuel Outlet Pressure', valueField: 'fuelOutletPressure', color: '#10B981', type: 'line' },
//   ];

//   const turboEffectivenessConfig = [
//     { name: 'Boost Pressure', valueField: 'boostPressure', color: '#10B981', type: 'line' },
//     { name: 'Load (%)', valueField: 'loadPercent', color: '#8B5CF6', type: 'line' },
//   ];

//   const fuelAmbientPressureConfig = [
//     { name: 'Fuel Outlet Pressure', valueField: 'fuelPressure', color: '#EF4444', type: 'line' },
//     { name: 'Ambient Pressure', valueField: 'ambientPressure', color: '#3B82F6', type: 'line' },
//   ];

//   const baseApiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/lubrication`;


//   return (
//     <>
//       <div className="grid grid-cols-1 gap-4 mt-6 operational-kpis md:grid-cols-2 lg:grid-cols-2">
//         {/* Lubrication Health */}
//         <GeneralOperator
//           title="Lubrication Health"
//           chartId="lubrication-health"
//           seriesConfig={lubricationHealthConfig}
//           apiUrl={`${baseApiUrl}/lubrication-health`}
//           yAxisTitleLeft="Oil Pressure"
//           yAxisTitleRight="Oil Temperature"
//           showMarkers={true}
//           extraPayload={{ type: 'generator' }}
//           infoContent="Monitors oil pressure and temperature for lubrication system integrity."
//         />

//         {/* Electrical Stability */}
//         <GeneralOperator
//           title="Electrical Stability"
//           chartId="electrical-stability"
//           seriesConfig={electricalStabilityConfig}
//           apiUrl={`${baseApiUrl}/electrical-stability`}
//           yAxisTitleLeft="Lubrication Risk Index"
//           extraPayload={{ type: 'generator' }}
//           infoContent="Tracks voltage fluctuations to ensure electrical system reliability."
//         />

//         {/* Lubrication Pressure Response to Engine Speed */}
//         <GeneralOperator
//           title="Lubrication Pressure Response to Engine Speed"
//           chartId="lub-pressure-response"
//           seriesConfig={lubPressureResponseConfig}
//           apiUrl={`${baseApiUrl}/lub-pressure-response`}
//           yAxisTitleLeft="Oil Pressure"
//           yAxisTitleRight="Engine Speed"
//           extraPayload={{ type: 'generator' }}
//           infoContent="Analyzes lubrication pressure dynamics in response to engine speed variations."
//         />

//         {/* Air-Fuel Pressure Profile */}
//         <GeneralOperator
//           title="Air-Fuel Pressure Profile"
//           chartId="air-fuel-profile"
//           seriesConfig={airFuelProfileConfig}
//           apiUrl={`${baseApiUrl}/air-fuel-profile`}
//           yAxisTitleLeft="Boost Pressure"
//           yAxisTitleRight="Fuel Outlet Pressure"
//           extraPayload={{ type: 'generator' }}
//           infoContent="Profiles air and fuel pressures for optimal combustion mixture."
//         />

//         {/* Turbocharger Effectiveness */}
//         <GeneralOperator
//           title="Turbo Charger Effectiveness"
//           chartId="turbo-effectiveness"
//           seriesConfig={turboEffectivenessConfig}
//           apiUrl={`${baseApiUrl}/turbo-effectiveness`}
//           yAxisTitleLeft="Boost Pressure"
//           yAxisTitleRight="Load (%)"
//           extraPayload={{ type: 'generator' }}
//           infoContent="Evaluates turbocharger performance through boost and efficiency metrics."
//         />

//         {/* Fuel Pressure vs Ambient Pressure */}
//         <GeneralOperator
//           title="Fuel Pressure vs Ambient Pressure"
//           chartId="fuel-ambient-pressure"
//           seriesConfig={fuelAmbientPressureConfig}
//           apiUrl={`${baseApiUrl}/fuel-ambient-pressure`}
//           yAxisTitleLeft="Pressure Comparison"
//           extraPayload={{ type: 'generator' }}
//           infoContent="Compares fuel delivery pressure against ambient conditions for system adequacy."
//         />
//       </div>
//     </>
//   );
// };

// export default LubricationPressure;


"use client";
import React from "react";
import GeneralOperator from "@/components/OperatorDashboard/GeneralOperator"; 

const LubricationPressure = ({ view = "live", startDate, endDate, isRange }) => {
  const lubricationHealthConfig = [
    { name: 'Oil Pressure', valueField: 'Oil_Pressure', color: '#8B5CF6', type: 'line' },
    { name: 'Oil Temperature', valueField: 'Oil_Temperature', color: '#3B82F6', type: 'line', yAxis: 'right' },
  ];

  const electricalStabilityConfig = [
    { name: 'Lubrication Risk Index', valueField: 'Lubrication_Risk_Index', color: '#10B981', type: 'line' },
  ];

  const lubPressureResponseConfig = [
    { name: 'Oil Pressure', valueField: 'Oil_Pressure', color: '#F59E0B', type: 'line' },
    { name: 'Engine Speed', valueField: 'Averagr_Engine_Speed', color: '#10B981', type: 'line' },
  ];

  const airFuelProfileConfig = [
    { name: 'Boost Pressure', valueField: 'Boost_Pressure', color: '#3B82F6', type: 'line' },
    { name: 'Fuel Outlet Pressure', valueField: 'Fuel_Outlet_Pressure_calculated', color: '#10B981', type: 'line' },
  ];

  const turboEffectivenessConfig = [
    { name: 'Boost Pressure', valueField: 'Boost_Pressure', color: '#10B981', type: 'line' },
    { name: 'Load (%)', valueField: 'LoadPercent', color: '#8B5CF6', type: 'line', yAxis: 'right' },
  ];

  const fuelAmbientPressureConfig = [
    { name: 'Fuel Outlet Pressure', valueField: 'Fuel_Outlet_Pressure_calculated', color: '#EF4444', type: 'line' },
    { name: 'Ambient Pressure', valueField: 'Barometric_Absolute_Pressure', color: '#3B82F6', type: 'line', yAxis: 'right' },
  ];

  const baseApiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/lubrication`;

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
        {/* Lubrication Health */}
        <GeneralOperator
          title="Lubrication Health"
          chartId="lubrication-health"
          seriesConfig={lubricationHealthConfig}
          apiUrl={`${baseApiUrl}/lubrication-health`}
          yAxisTitleLeft="Oil Pressure"
          yAxisTitleRight="Oil Temperature"
          showMarkers={true}
          extraPayload={getCommonPayload()}
          infoContent="Monitors oil pressure and temperature for lubrication system integrity."
        />

        {/* Electrical Stability */}
        <GeneralOperator
          title="Electrical Stability"
          chartId="electrical-stability"
          seriesConfig={electricalStabilityConfig}
          apiUrl={`${baseApiUrl}/lubrication-health`}
          yAxisTitleLeft="Lubrication Risk Index"
          extraPayload={getCommonPayload()}
          infoContent="Tracks voltage fluctuations to ensure electrical system reliability."
        />

        {/* Lubrication Pressure Response to Engine Speed */}
        <GeneralOperator
          title="Lubrication Pressure Response to Engine Speed"
          chartId="lub-pressure-response"
          seriesConfig={lubPressureResponseConfig}
          apiUrl={`${baseApiUrl}/lub-pressure-response`}
          yAxisTitleLeft="Oil Pressure"
          yAxisTitleRight="Engine Speed"
          extraPayload={getCommonPayload()}
          infoContent="Analyzes lubrication pressure dynamics in response to engine speed variations."
        />

        {/* Air-Fuel Pressure Profile */}
        <GeneralOperator
          title="Air-Fuel Pressure Profile"
          chartId="air-fuel-profile"
          seriesConfig={airFuelProfileConfig}
          apiUrl={`${baseApiUrl}/air-fuel-profile`}
          yAxisTitleLeft="Boost Pressure"
          yAxisTitleRight="Fuel Outlet Pressure"
          extraPayload={getCommonPayload()}
          infoContent="Profiles air and fuel pressures for optimal combustion mixture."
        />

        {/* Turbocharger Effectiveness */}
        <GeneralOperator
          title="Turbo Charger Effectiveness"
          chartId="turbo-effectiveness"
          seriesConfig={turboEffectivenessConfig}
          apiUrl={`${baseApiUrl}/turbo-effectiveness`}
          yAxisTitleLeft="Boost Pressure"
          yAxisTitleRight="Load (%)"
          extraPayload={getCommonPayload()}
          infoContent="Evaluates turbocharger performance through boost and efficiency metrics."
        />

        {/* Fuel Pressure vs Ambient Pressure */}
        <GeneralOperator
          title="Fuel Pressure vs Ambient Pressure"
          chartId="fuel-ambient-pressure"
          seriesConfig={fuelAmbientPressureConfig}
          apiUrl={`${baseApiUrl}/fuel-ambient-pressure`}
          yAxisTitleLeft="Pressure Comparison"
          extraPayload={getCommonPayload()}
          infoContent="Compares fuel delivery pressure against ambient conditions for system adequacy."
        />
      </div>
    </>
  );
};

export default LubricationPressure;
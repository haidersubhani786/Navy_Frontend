"use client";
import React from "react";
import MetricCard from "../metricCard";
import GeneralOperator from "@/components/OperatorDashboard/GeneralOperator"; 

const PerformanceGeneral = ({ view = "live", startDate, endDate, isRange }) => {
  const outputEfficiencyConfig = [
    { name: 'Genset_Total_KW', valueField: 'Genset_Total_kW', color: '#5A895C', type: 'line' }, // 8B5CF6
    { name: 'Generator Efficiency', valueField: 'baselineEfficiency', color: '#CA49A7', type: 'line',  yAxis: 'right' }, // 3B82F6
  ];

  const generatorOscillationConfig = [
    { name: 'Oscillation Index', valueField: 'Oscillation_Index', color: '#159089', type: 'line' }, // 10B981
  ];

  const rpmStabilityConfig = [
    { name: 'Average_Engine_Speed', valueField: 'Averagr_Engine_Speed', color: '#20B2AA', type: 'line' }, // F59E0B
    { name: 'RPM Stability Index', valueField: 'stabilityIndex', color: '#E75956', type: 'line' }, // 3B82F6
  ];

  const multiDimensionalStressConfig = [
    { name: 'Mechanical Stress', valueField: 'Mechanical_Stress', color: '#A9D5AA', type: 'line' }, // 06B6D4
    { name: 'Electrical Stress', valueField: 'thermalStress', color: '#0475B0', type: 'line' }, // F59E0B
  ];

  const torqueSpeedCharacteristicsConfig = [
    { name: 'Percent Engine Torque', valueField: 'Percent_Engine_Torque_or_Duty_Cycle', color: '#E75956', type: 'line' }, // 10B981
    { name: 'Engine Speed', valueField: 'Engine_Running_Time_calculated', color: '#828933', type: 'line', yAxis: 'right' }, // 8B5CF6
  ];

  const torqueFuelRelationshipConfig = [
    { name: 'Fuel Rate', valueField: 'Fuel_Rate', color: '#20B2AA', type: 'line' }, // F59E0B
    { name: 'Percent Engine Torque', valueField: 'Percent_Engine_Torque_or_Duty_Cycle', color: '#E75956', type: 'line', yAxis: 'right' }, // 10B981
  ];

  const baseApiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/performance-general`; 

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
      <div className="grid grid-cols-1 gap-2 operational-kpis md:grid-cols-2 lg:grid-cols-3">
        <MetricCard 
          title="Energy" 
          apiEndpoint={baseApiUrl} 
          unit="KWH" 
          color="black" 
          valueField="energyKWh"
          extraPayload={getCommonPayload()}
        />
        <MetricCard 
          title="Total Fuel Consumption" 
          apiEndpoint={baseApiUrl} 
          unit="KWH" 
          color="green" 
          valueField="totalFuelConsumption"
          extraPayload={getCommonPayload()}
        />
        <MetricCard 
          title="Fuel Consumption" 
          apiEndpoint={baseApiUrl} 
          unit="KWH" 
          color="red" 
          valueField="fuelConsumptionCurrentRun"
          extraPayload={getCommonPayload()}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 mt-4 operational-kpis md:grid-cols-2 lg:grid-cols-2">
        <GeneralOperator
          title="Output Efficiency Performance"
          chartId="output-efficiency"
          seriesConfig={outputEfficiencyConfig}
          apiUrl={`${baseApiUrl}/output-efficiency`}
          yAxisTitleLeft="Genset_Total_KW"
          yAxisTitleRight="Generator Efficiency"
          showMarkers={true}
          extraPayload={getCommonPayload()}
        />

        <GeneralOperator
          title="Generator Oscillation Index"
          chartId="generator-oscillation"
          seriesConfig={generatorOscillationConfig}
          apiUrl={`${baseApiUrl}/generator-oscillation`}
          yAxisTitleLeft="Oscillation Level"
          yAxisTitleRight="Threshold"
          extraPayload={getCommonPayload()}
        />

        <GeneralOperator
          title="RPM Stability"
          chartId="rpm-stability"
          seriesConfig={rpmStabilityConfig}
          apiUrl={`${baseApiUrl}/rpm-stability`}
          yAxisTitleLeft="Stability Metrics"
          extraPayload={getCommonPayload()}
        />

        <GeneralOperator
          title="Multi-dimensional Stress"
          chartId="multi-dimensional-stress"
          seriesConfig={multiDimensionalStressConfig}
          apiUrl={`${baseApiUrl}/multi-dimensional-stress`}
          yAxisTitleLeft="Stress Index"
          extraPayload={getCommonPayload()}
        />

        <GeneralOperator
          title="Torque Speed Characteristics"
          chartId="torque-speed-characteristics"
          seriesConfig={torqueSpeedCharacteristicsConfig}
          apiUrl={`${baseApiUrl}/torque-speed-characteristics`}
          yAxisTitleLeft="Percent Engine Torque"
          yAxisTitleRight="Engine Speed"
          extraPayload={getCommonPayload()}
        />

        <GeneralOperator
          title="Torque Fuel Relationship"
          chartId="torque-fuel-relationship"
          seriesConfig={torqueFuelRelationshipConfig}
          apiUrl={`${baseApiUrl}/torque-fuel-relationship`}
          yAxisTitleLeft="Fuel Rate"
          yAxisTitleRight="Percent Engine Torque"
          extraPayload={getCommonPayload()}
        />
      </div>
    </>
  );
};

export default PerformanceGeneral;
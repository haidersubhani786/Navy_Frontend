"use client";
import React from "react";
import MetricCard from "../metricCard";
import GeneralOperator from "@/components/OperatorDashboard/GeneralOperator"; 

const PerformanceGeneral = ({ view = "live", startDate, endDate, isRange }) => {
  const outputEfficiencyConfig = [
    { name: 'Genset_Total_KW', valueField: 'Genset_Total_kW', color: '#8B5CF6', type: 'line' },
    { name: 'Generator Efficiency', valueField: 'baselineEfficiency', color: '#3B82F6', type: 'line',  yAxis: 'right' },
  ];

  const generatorOscillationConfig = [
    { name: 'Oscillation Index', valueField: 'oscillationIndex', color: '#10B981', type: 'line' },
  ];

  const rpmStabilityConfig = [
    { name: 'Average_Engine_Speed', valueField: 'Averagr_Engine_Speed', color: '#F59E0B', type: 'line' },
    { name: 'RPM Stability Index', valueField: 'stabilityIndex', color: '#3B82F6', type: 'line' },
  ];

  const multiDimensionalStressConfig = [
    { name: 'Mechanical Stress', valueField: 'mechanicalStress', color: '#06B6D4', type: 'line' },
    { name: 'Electrical Stress', valueField: 'thermalStress', color: '#F59E0B', type: 'line' },
  ];

  const torqueSpeedCharacteristicsConfig = [
    { name: 'Percent Engine Torque', valueField: 'Percent_Engine_Torque_or_Duty_Cycle', color: '#10B981', type: 'line' },
    { name: 'Engine Speed', valueField: 'Engine_Running_Time_calculated', color: '#8B5CF6', type: 'line', yAxis: 'right' },
  ];

  const torqueFuelRelationshipConfig = [
    { name: 'Fuel Rate', valueField: 'Fuel_Rate', color: '#F59E0B', type: 'line' },
    { name: 'Percent Engine Torque', valueField: 'Percent_Engine_Torque_or_Duty_Cycle', color: '#10B981', type: 'line', yAxis: 'right' },
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
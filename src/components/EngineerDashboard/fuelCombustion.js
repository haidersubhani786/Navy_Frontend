"use client";
import React from "react";
import GeneralOperator from "@/components/OperatorDashboard/GeneralOperator"; 

const FuelCombustion = ({ view = "live", startDate, endDate, isRange }) => {
  const fuelConsumptionLoadConfig = [
    { name: 'Fuel Rate', valueField: 'Fuel_Rate', color: '#3B82F6', type: 'line' },
    { name: 'Load (%)', valueField: 'LoadPercent', color: '#A855F7', type: 'line', yAxis: 'right' },
  ];

  const fuelUtilizationThermalConfig = [
    { name: 'Fuel Flow Rate(L/h)/Power Output(KW)', valueField: 'fuelUtilization', color: '#10B981', type: 'line' },
    { name: 'Thermal Efficiency', valueField: 'thermalEfficiency', color: '#F59E0B', type: 'line' },
  ];

  const fuelGeneratorEfficiencyConfig = [
    { name: 'Fuel Efficiency', valueField: 'SpecificFuelConsumption', color: '#EF4444', type: 'line' },
    { name: 'Genset Efficiency', valueField: 'generatorEfficiency', color: '#22C55E', type: 'line' },
  ];

  const combustionMixtureConfig = [
    { name: 'Heat Rate', valueField: 'HeatRate', color: '#10B981', type: 'line' },
  ];

  const fuelFlowVariabilityConfig = [
    { name: 'Fuel Flow Rate Change', valueField: 'FuelFlowRateChange', color: '#22C55E', type: 'line' },
  ];

  const injectionSystemHealthConfig = [
    { name: 'Fuel Rate', valueField: 'Fuel_Rate', color: '#3B82F6', type: 'line' },
    { name: 'Fuel Outlet Pressure', valueField: 'Fuel_Outlet_Pressure', color: '#A855F7', type: 'line', yAxis: 'right' },
  ];

const baseApiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/fuel-combustion`;

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
          title="Fuel Consumption vs Load"
          chartId="fuel-consumption-load"
          seriesConfig={fuelConsumptionLoadConfig}
          apiUrl={`${baseApiUrl}/fuel-consumption-load`}
          yAxisTitleLeft="Fuel Consumption"
          yAxisTitleRight="Load"
          showMarkers={true}
          extraPayload={getCommonPayload()}
          infoContent="Tracks fuel consumption trends relative to load variations for efficiency analysis."
        />

        <GeneralOperator
          title="Fuel Utilization & Thermal Efficiency"
          chartId="fuel-utilization-thermal"
          seriesConfig={fuelUtilizationThermalConfig}
          apiUrl={`${baseApiUrl}/fuel-utilization-thermal`}
          yAxisTitleLeft="Fuel Utilization"
          yAxisTitleRight="Thermal Efficiency"
          extraPayload={getCommonPayload()}
          infoContent="Measures fuel utilization alongside thermal efficiency to optimize energy conversion."
        />

        <GeneralOperator
          title="Fuel Efficiency & Generator Efficiency"
          chartId="fuel-generator-efficiency"
          seriesConfig={fuelGeneratorEfficiencyConfig}
          apiUrl={`${baseApiUrl}/fuel-generator-efficiency`}
          yAxisTitleLeft="Fuel Efficiency"
          yAxisTitleRight="Generator Efficiency"
          extraPayload={getCommonPayload()}
          infoContent="Compares fuel and generator efficiencies to identify performance bottlenecks."
        />

        <GeneralOperator
          title="Combustion Mixture Effectiveness"
          chartId="combustion-mixture"
          seriesConfig={combustionMixtureConfig}
          apiUrl={`${baseApiUrl}/combustion-mixture`}
          yAxisTitleLeft="Air Fuel Ratio"
          extraPayload={getCommonPayload()}
          infoContent="Evaluates air-fuel mixture for combustion quality and emissions control."
        />

        <GeneralOperator
          title="Fuel Flow Variability"
          chartId="fuel-flow-variability"
          seriesConfig={fuelFlowVariabilityConfig}
          apiUrl={`${baseApiUrl}/fuel-flow-variability`}
          yAxisTitleLeft="Fuel Flow Rate Change"
          extraPayload={getCommonPayload()}
          infoContent="Monitors variations in fuel flow to detect supply inconsistencies."
        />

        <GeneralOperator
          title="Injection System Health"
          chartId="injection-system-health"
          seriesConfig={injectionSystemHealthConfig}
          apiUrl={`${baseApiUrl}/injection-system-health`}
          yAxisTitleLeft="Fuel Rate"
          yAxisTitleRight="Fuel Outlet Pressure"
          extraPayload={getCommonPayload()}
          infoContent="Assesses fuel injection health through injector performance and pressure."
        />
      </div>
    </>
  );
};

export default FuelCombustion;
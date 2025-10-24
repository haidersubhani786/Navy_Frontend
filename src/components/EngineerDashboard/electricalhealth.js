"use client";
import React from "react";
import MetricCard from "../metricCard";
import GeneralOperator from "@/components/OperatorDashboard/GeneralOperator"; 


// New Commit
const ElectricalHealth = ({ view = "live", startDate, endDate, isRange }) => {
  const phaseBalanceConfig = [
    { name: 'Phase A Balance', valueField: 'Genset_L1_Current', color: '#D25250', type: 'line' },
    { name: 'Phase B Balance', valueField: 'Genset_L2_Current', color: '#DFBB4E', type: 'line' },
    { name: 'Phase C Balance', valueField: 'Genset_L3_Current', color: '#159089', type: 'line' },
    { name: 'Current Imbalance(%)', valueField: 'CurrentImbalance', color: '#4169E1', type: 'line', yAxis: 'right'  }
  ];

  const electroMechanicalStressConfig = [
    { name: 'Electric Stress and Load Stress', valueField: 'LoadStress', color: '#20B2AA', type: 'line' },
  ];

  const voltageQualityConfig = [
    { name: 'Phase A', valueField: 'Genset_L1L2_Voltage', color: '#D25250', type: 'line' }, // #F59E0B
    { name: 'Phase B', valueField: 'Genset_L2L3_Voltage', color: '#DFBB4E', type: 'line' }, // #10B981
    { name: 'Phase C', valueField: 'Genset_L3L1_Voltage', color: '#159089', type: 'line' }, // #3B82F6
    { name: 'Voltage Imbalance (%)', valueField: 'voltageImbalance', color: '#4169E1', type: 'line', yAxis: 'right' }, // #8B5CF6
  ];

  const loadPowerFactorConfig = [
    { name: 'Load %', valueField: 'LoadPercent', color: '#20B2AA', type: 'line' }, // 10B981
    { name: 'Power Factor', valueField: 'Genset_Total_Power_Factor_calculated', color: '#E75956', type: 'line', yAxis: 'right' }, // 3B82F6
  ];

  const lossesThermalStressConfig = [
    { name: 'Power Loss Index', valueField: 'PowerLossFactor', color: '#5A895C', type: 'line' }, // 10B981
    { name: '12R Heating', valueField: 'I2', color: '#CA49A7', type: 'line', yAxis: 'right' }, // EF4444
  ];

  const frequencyRegulationConfig = [
    { name: 'Genset Frequency', valueField: 'Genset_Frequency_OP_calculated', color: '#A9D5AA', type: 'line' }, // 10B981
    { name: 'Grid Deviation', valueField: 'grDeviation', color: '#0475B0', type: 'line', yAxis: 'right' }, // 3B82F6
  ];

 const baseApiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/electrical-health`;
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
          title="Active Power" 
          apiEndpoint={baseApiUrl} 
          unit="KWH" 
          color="black"
          valueField="activePowerL1"
          extraPayload={getCommonPayload()}
        />
        <MetricCard 
          title="Active Power" 
          apiEndpoint={baseApiUrl} 
          unit="KWH" 
          color="green"
          valueField="activePowerL2"
          extraPayload={getCommonPayload()}
        />
        <MetricCard 
          title="Active Power" 
          apiEndpoint={baseApiUrl} 
          unit="KWH" 
          color="red"
          valueField="activePowerL3"
          extraPayload={getCommonPayload()}
        />
        <MetricCard 
          title="Line Voltages" 
          apiEndpoint={baseApiUrl} 
          unit="KWH" 
          color="blue"
          valueField="voltageL1"
          extraPayload={getCommonPayload()}
        />
        <MetricCard 
          title="Line Voltages" 
          apiEndpoint={baseApiUrl} 
          unit="KWH" 
          color="yellow"
          valueField="voltageL2"
          extraPayload={getCommonPayload()}
        />
        <MetricCard 
          title="Line Voltages" 
          apiEndpoint={baseApiUrl} 
          unit="KWH" 
          color="purple"
          valueField="voltageL3"
          extraPayload={getCommonPayload()}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 mt-4 operational-kpis md:grid-cols-2 lg:grid-cols-2">
        {/* Phase Balance Effectiveness */}
        <GeneralOperator
          title="Phase Balance Effectiveness"
          chartId="phase-balance"
          seriesConfig={phaseBalanceConfig}
          apiUrl={`${baseApiUrl}/phase-balance`}
          yAxisTitleLeft="Phase Wise Current"
          yAxisTitleRight="Current Imbalance (%)"
          showMarkers={true}
          extraPayload={getCommonPayload()}
        />

        {/* Electro-Mechanical Stress Index */}
        <GeneralOperator
          title="Electro-Mechanical Stress Index"
          chartId="electro-mechanical-stress"
          seriesConfig={electroMechanicalStressConfig}
          apiUrl={`${baseApiUrl}/electro-mechanical-stress`}
          yAxisTitleLeft="Electric Stress and Load Stress"
          extraPayload={getCommonPayload()}
        />

        {/* Voltage Quality & Symmetry */}
        <GeneralOperator
          title="Voltage Quality & Symmetry"
          chartId="voltage-quality"
          seriesConfig={voltageQualityConfig}
          apiUrl={`${baseApiUrl}/voltage-quality`}
          yAxisTitleLeft="Line to Line Voltages"
          yAxisTitleRight="Voltage Imbalance (%)"
          extraPayload={getCommonPayload()}
        />

        {/* Load vs Power Factor */}
        <GeneralOperator
          title="Load vs Power Factor"
          chartId="load-power-factor"
          seriesConfig={loadPowerFactorConfig}
          apiUrl={`${baseApiUrl}/load-power-factor`}
          yAxisTitleLeft="Load (%)"
          yAxisTitleRight="Power Factor"
          extraPayload={getCommonPayload()}
        />

        {/* Losses & Thermal Stress */}
        <GeneralOperator
          title="Losses & Thermal Stress"
          chartId="losses-thermal-stress"
          seriesConfig={lossesThermalStressConfig}
          apiUrl={`${baseApiUrl}/losses-thermal`}
          yAxisTitleLeft="Power Loss Index"
          yAxisTitleRight="12R Heating"
          extraPayload={getCommonPayload()}
        />

        {/* Frequency Regulation Effectiveness */}
        <GeneralOperator
          title="Frequency Regulation Effectiveness"
          chartId="frequency-regulation"
          seriesConfig={frequencyRegulationConfig}
          apiUrl={`${baseApiUrl}/frequency-regulation`}
          yAxisTitleLeft="High Frequency Index"
          yAxisTitleRight="Grid Deviation"
          extraPayload={getCommonPayload()}
        />
      </div>
    </>
  );
};

export default ElectricalHealth;
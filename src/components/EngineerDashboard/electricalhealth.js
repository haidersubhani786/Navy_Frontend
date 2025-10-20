"use client";
import React from "react";
import MetricCard from "../metricCard";
import GeneralOperator from "@/components/OperatorDashboard/GeneralOperator"; 


// New Commit
const ElectricalHealth = ({ view = "live", startDate, endDate, isRange }) => {
  const phaseBalanceConfig = [
    { name: 'Phase A Balance', valueField: 'Genset_L1_Current', color: '#10B981', type: 'line' },
    { name: 'Phase B Balance', valueField: 'Genset_L2_Current', color: '#F59E0B', type: 'line' },
    { name: 'Phase C Balance', valueField: 'Genset_L3_Current', color: '#EF4444', type: 'line' },
    { name: 'Current Imbalance(%)', valueField: 'currentImbalance', color: '#8A2BE2', type: 'line', yAxis: 'right'  }
  ];

  const electroMechanicalStressConfig = [
    { name: 'Electric Stress and Load Stress', valueField: 'stressIndex', color: '#10B981', type: 'line' },
  ];

  const voltageQualityConfig = [
    { name: 'Phase A', valueField: 'Genset_L1L2_Voltage', color: '#F59E0B', type: 'line' },
    { name: 'Phase B', valueField: 'Genset_L2L3_Voltage', color: '#10B981', type: 'line' },
    { name: 'Phase C', valueField: 'Genset_L3L1_Voltage', color: '#3B82F6', type: 'line' },
    { name: 'Voltage Imbalance (%)', valueField: 'voltageImbalance', color: '#8B5CF6', type: 'line', yAxis: 'right' },
  ];

  const loadPowerFactorConfig = [
    { name: 'Load %', valueField: 'LoadPercent', color: '#10B981', type: 'line' },
    { name: 'Power Factor', valueField: 'Genset_Total_Power_Factor_calculated', color: '#3B82F6', type: 'line', yAxis: 'right' },
  ];

  const lossesThermalStressConfig = [
    { name: 'Power Loss Index', valueField: 'PowerLossFactor', color: '#10B981', type: 'line' },
    { name: '12R Heating', valueField: 'I2', color: '#EF4444', type: 'line', yAxis: 'right' },
  ];

  const frequencyRegulationConfig = [
    { name: 'Genset Frequency', valueField: 'Genset_Frequency_OP_calculated', color: '#10B981', type: 'line' },
    { name: 'Grid Deviation', valueField: 'grDeviation', color: '#3B82F6', type: 'line', yAxis: 'right' },
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
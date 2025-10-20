// import React from 'react';
// import Image from 'next/image';

// const GaugeChart = ({ value = 10, minValue = 0, maxValue = 100 }) => {
//   // Configuration
//   const startAngle = -215; // Left side se start (green area)
//   const endAngle = 45;     // Right side end (red area)
  
//   // Calculate position angle (alpha)
//   const valueToAngle = (val) => {
//     const percentage = (val - minValue) / (maxValue - minValue);
//     return startAngle + percentage * (endAngle - startAngle);
//   };
  
//   const alpha = valueToAngle(value);
  
//   // Convert angle to radians
//   const toRadians = (angle) => (angle * Math.PI) / 180;
  
//   // Calculate needle rotation angle (theta) to point correctly to alpha position
//   const alphaRad = toRadians(alpha);
//   const sinAlpha = Math.sin(alphaRad);
//   const cosAlpha = Math.cos(alphaRad);
//   const thetaRad = Math.atan2(cosAlpha, -sinAlpha);
//   const needleAngle = (thetaRad * 180 / Math.PI);
  
//   // Generate tick marks and labels
//   const generateTicks = () => {
//     const ticks = [];
//     const majorTickInterval = 20;
//     const minorTickInterval = 5;
//     const radius = 85;
//     const centerX = 128;
//     const centerY = 128;
    
//     for (let i = minValue; i <= maxValue; i += minorTickInterval) {
//       const angle = valueToAngle(i);
//       const isMajor = i % majorTickInterval === 0;
//       const tickLength = isMajor ? 10 : 5;
//       const tickWidth = isMajor ? 3 : 2;
//       const innerRadius = radius;
//       const outerRadius = innerRadius - tickLength;
      
//       const x1 = centerX + innerRadius * Math.cos(toRadians(angle));
//       const y1 = centerY + innerRadius * Math.sin(toRadians(angle));
//       const x2 = centerX + outerRadius * Math.cos(toRadians(angle));
//       const y2 = centerY + outerRadius * Math.sin(toRadians(angle));
      
//       ticks.push(
//         <line
//           key={`tick-${i}`}
//           x1={x1}
//           y1={y1}
//           x2={x2}
//           y2={y2}
//           stroke="#ffffff"
//           strokeWidth={tickWidth}
//         />
//       );
      
//       if (isMajor) {
//         const labelRadius = outerRadius - 14;
//         const labelX = centerX + labelRadius * Math.cos(toRadians(angle));
//         const labelY = centerY + labelRadius * Math.sin(toRadians(angle));
        
//         ticks.push(
//           <text
//             key={`label-${i}`}
//             x={labelX}
//             y={labelY}
//             fill="#ccc"
//             fontSize="20"
//             fontWeight="600"
//             textAnchor="middle"
//             dominantBaseline="middle"
//           >
//             {i}
//           </text>
//         );
//       }
//     }
    
//     return ticks;
//   };
  
//   return (
//     <div className="relative w-full h-full">
//       {/* Background Gauge Image */}
//       <img 
//         src="/gauge.png"
//         alt="Gauge Background"
//         className="absolute top-0 left-0 object-contain w-full h-27"
//       />
      
//       {/* SVG overlay for inner circle with ticks and numbers */}
//       <svg 
//         className="absolute top-[-7px] left-0 w-full h-full"
//         viewBox="0 0 256 236"
//       >
//         {/* Inner circle background */}
//         {/* <circle
//           cx="128"
//           cy="128"
//           r="90"
//           fill="#2d2d2d"
//           stroke="#444"
//           strokeWidth="1"
//           opacity="0.95"
//         /> */}
        
//         {/* Tick marks and labels */}
//         {generateTicks()}
        
//         {/* Value display in center */}
//         <text
//           x="128"
//           y="220"
//           fill="white"
//           fontSize="42"
//           fontWeight="bold"
//           textAnchor="middle"
//           dominantBaseline="middle"
//         >
//           {value.toFixed(1)}
//         </text>
//       </svg>
      
//       {/* Needle */}
//       <div 
//         className="absolute origin-bottom top-1/2 left-1/2"
//         style={{
//           transform: `translate(-50%, -100%) rotate(${needleAngle}deg)`,
//           transition: 'transform 0.5s ease-out'
//         }}
//       >
//         <div className="relative w-0.5 h-8 rounded-full shadow-xl bg-gradient-to-t from-[#d2d2d2] to-[#d2d2d2]">
//           <div className="absolute w-0 h-0 transform -translate-x-1/2 border-b-4 border-l-2 border-r-2 -top-1 left-1/2 border-l-transparent border-r-transparent border-b-[white]"></div>
//         </div>
//       </div>
      
//       {/* Center circle */}
//       <div className="absolute z-10 w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 bg-[#333333] border-[#d2d2d2] rounded-full shadow-lg top-1/2 left-1/2 border-1"></div>
//     </div>
//   );
// };

// export default GaugeChart;


import React from 'react';
import Image from 'next/image';

const GaugeChart = ({ value = 0, minValue = 0, maxValue = 100, majorTickInterval = 20, minorTickInterval = 5 }) => {
  
  const startAngle = -215; 
  const endAngle = 45;    
  
  const valueToAngle = (val) => {
    const percentage = (val - minValue) / (maxValue - minValue);
    return startAngle + percentage * (endAngle - startAngle);
  };
  
  const alpha = valueToAngle(value);
  
  const toRadians = (angle) => (angle * Math.PI) / 180;
  
  const alphaRad = toRadians(alpha);
  const sinAlpha = Math.sin(alphaRad);
  const cosAlpha = Math.cos(alphaRad);
  const thetaRad = Math.atan2(cosAlpha, -sinAlpha);
  const needleAngle = (thetaRad * 180 / Math.PI);
  
  const generateTicks = () => {
    const ticks = [];
    const radius = 85;
    const centerX = 128;
    const centerY = 128;
    
    for (let i = minValue; i <= maxValue; i += minorTickInterval) {
      const angle = valueToAngle(i);
      const isMajor = i % majorTickInterval === 0;
      const tickLength = isMajor ? 10 : 5;
      const tickWidth = isMajor ? 3 : 2;
      const innerRadius = radius;
      const outerRadius = innerRadius - tickLength;
      
      const x1 = centerX + innerRadius * Math.cos(toRadians(angle));
      const y1 = centerY + innerRadius * Math.sin(toRadians(angle));
      const x2 = centerX + outerRadius * Math.cos(toRadians(angle));
      const y2 = centerY + outerRadius * Math.sin(toRadians(angle));
      
      ticks.push(
        <line
          key={`tick-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#ffffff"
          strokeWidth={tickWidth}
        />
      );
      
      if (isMajor) {
        const labelRadius = outerRadius - 14;
        const labelX = centerX + labelRadius * Math.cos(toRadians(angle));
        const labelY = centerY + labelRadius * Math.sin(toRadians(angle));
        
        ticks.push(
          <text
            key={`label-${i}`}
            x={labelX}
            y={labelY}
            fill="#ccc"
            fontSize="20"
            fontWeight="600"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {i}
          </text>
        );
      }
    }
    
    return ticks;
  };
  
  return (
    <div className="relative w-full h-full">
      {/* Background Gauge Image */}
      <img 
        src="/gauge.png"
        alt="Gauge Background"
        className="absolute top-0 left-0 z-0 object-contain w-full h-31"
      />
      
      <svg 
        className="absolute top-[-9px] left-0 w-full h-full z-5" 
        viewBox="0 0 256 195"
      >
        {generateTicks()}
        
        <text
          x="128"
          y="200"
          fill="white"
          fontSize="0"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {value.toFixed(1)}
        </text>
      </svg>
      
      <div 
        className="absolute z-10 origin-bottom top-[57%] left-1/2" // z-index for needle on top
        style={{
          transform: `translate(-50%, -100%) rotate(${needleAngle}deg)`,
          transition: 'transform 0.5s ease-out'
        }}
      >
        <div className="relative w-0.5 h-8 rounded-full shadow-xl bg-gradient-to-t from-[#d2d2d2] to-[#d2d2d2]">
          <div className="absolute w-0 h-0 transform -translate-x-1/2 border-b-4 border-l-2 border-r-2 -top-1 left-1/2 border-l-transparent border-r-transparent border-b-[white]"></div>
        </div>
      </div>
      
      {/* Center circle */}
      <div className="absolute z-20 w-6 h-6 transform -translate-x-1/2 -translate-y-[20%] bg-[#333333] border-[#d2d2d2] rounded-full shadow-lg top-1/2 left-1/2 border-1"></div> {/* Higher z-index */}
    </div>
  );
};

export default GaugeChart;
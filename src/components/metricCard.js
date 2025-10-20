import React, { useState, useEffect } from 'react';

const MetricCard = ({ 
  title, 
  apiEndpoint, 
  unit = 'KWH', 
  color = 'blue',
  valueField = 'value', // Default to 'value' if not provided
  extraPayload = {} // Default empty object
}) => {
  const [value, setValue] = useState(1000); // Default value as shown in image
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Build query string from extraPayload (clean, no duplicates)
  const buildQueryString = (payload) => {
    const params = new URLSearchParams();
    Object.entries(payload).forEach(([key, val]) => {
      if (val !== null && val !== undefined && val !== '') {
        params.append(key, val);
      }
    });
    return params.toString();
  };

  useEffect(() => {
    if (!apiEndpoint) {
      setValue(1000); // Static fallback if no endpoint
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const queryStr = buildQueryString(extraPayload);
    const url = `${apiEndpoint}${queryStr ? `?${queryStr}` : ''}`;
    
    console.log('MetricCard API URL:', url); // For debugging (remove in prod)

    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        return response.json();
      })
      .then(data => {
        // Use valueField to extract value; fallback to 1000
        const extractedValue = data[valueField];
        setValue(typeof extractedValue === 'number' ? extractedValue : (extractedValue ? Number(extractedValue) : 1000));
        setLoading(false);
      })
      .catch(err => {
        console.error('API Error:', err);
        setError('Failed to load');
        setValue(1000); // Fallback on error
        setLoading(false);
      });
  }, [apiEndpoint, valueField, extraPayload]); // Re-fetch on changes

  // Choose accent color class based on `color` prop (keeps default blue)
  const accent = color === 'green' ? 'bg-green-500' : 
                 color === 'red' ? 'bg-red-500' : 
                 color === 'black' ? 'bg-gray-800' : // Handle black
                 'bg-blue-500';

  return (
    <div className="bg-[linear-gradient(89.37deg,rgba(255,255,255,0.0015)_0.61%,rgba(255,255,255,0.078)_102.26%)] rounded-xl p-4 pr-10 shadow-md min-w-[260px] h-[10vh] flex flex-1">
      <div className="flex items-center justify-between w-full gap-4"> {/* Changed gap-35 to gap-4 (valid Tailwind class) and added w-full */}
        {/* Left: Title */}
        <div className="flex-1 min-w-0"> {/* Added min-w-0 to prevent overflow */}
          <div className={`text-lg ${accent === 'bg-gray-800' ? 'text-gray-300' : 'text-gray-300'} truncate`}>{title}</div> {/* Added truncate if title is long */}
        </div>

        {/* Right: white pill with value and unit */}
        <div className="flex-shrink-0 ml-auto"> {/* Added ml-auto to push it fully to the right end */}
          {loading ? (
            <div className="flex items-center justify-center w-24 px-3 py-3 rounded-md bg-white/90">
              <span className="text-xs text-gray-500">Loading</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center px-3 py-1 rounded-md bg-white/90 w-28">
              <span className="text-xs text-red-500">{error}</span>
            </div>
          ) : (
            <div className="flex items-center justify-center px-4 py-0 bg-white border border-gray-200 rounded-sm"> 
              <div className="font-mono text-[29px] text-black mr-1" style={{ fontFamily: "Digital-7" }}>{Number(value).toLocaleString()}</div> 
              <div className="text-lg font-medium text-gray-900 uppercase">{unit}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
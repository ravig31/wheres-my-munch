import React, { useState } from 'react';

function RadiusSlider({ onRadiusChange }) {
  const [radius, setRadius] = useState(10); // Default radius: 10 km

  const handleSliderChange = (e) => {
    const newRadius = parseInt(e.target.value, 10);
    setRadius(newRadius);
    onRadiusChange(newRadius); // Notify parent component of the new radius
  };

  return (
    <div>
      <label htmlFor="radius-slider">
        Select Radius: {radius} km
      </label>
      <input
        id="radius-slider"
        type="range"
        min="1"
        max="50"
        value={radius}
        onChange={handleSliderChange}
      />
    </div>
  );
}

export default RadiusSlider;
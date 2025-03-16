import React, { useState } from 'react';
import "../styles/RadiusSlider.css";

function RadiusSlider({ onRadiusChange }) {
  const [radius, setRadius] = useState(10); // Default radius: 10 km

  const handleSliderChange = (e) => {
    const newRadius = parseInt(e.target.value, 10);
    setRadius(newRadius);
    onRadiusChange(newRadius); // Notify parent component of the new radius
  };

  return (
    <div class='slider-container'>
        <p class="radius-head">How far are you willing to travel?</p>
      <label htmlFor="radius-slider">
        Select Radius: {radius} km
      </label>
      <br></br>
      <input
        id="radius-slider"
        type="range"
        min=".5"
        max="15"
        value={radius}
        onChange={handleSliderChange}
      />
    </div>
  );
}

export default RadiusSlider;
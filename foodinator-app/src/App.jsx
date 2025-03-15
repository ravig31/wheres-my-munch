import React, { useState } from 'react';
import './styles/global.css';
import './App.css';
import axios from 'axios';
import RadiusSlider from './components/RadiusSlider';

function App() {
  // State to track the current page/content
  const [currentPage, setCurrentPage] = useState('home'); // Can be 'home' or 'question'


  // State to track the current location
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);

  // State to track post code and coordinate  
  const API_KEY = 'AIzaSyCcWRBSHekVmyjqfB3K4mLdkf5Eg-XmBzI'
  const [postcode, setPostcode] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

  // Handle moving to the next page
  const handleNext = () => {
    setCurrentPage('question'); // Move from home to the question page
  };

  const handleConvert = async () => {
    try {
      // Make a request to the Geocoding API
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${postcode},AU&key=${API_KEY}`
      );

      // Extract latitude and longitude from the response
      const { lat, lng } = response.data.results[0].geometry.location;

      // Update state with the coordinates
      setCoordinates({ lat, lng });
      setError(null);
    } catch (err) {
      setError('Failed to convert postcode to coordinates. Please try again.');
      console.error(err);
    }
  };

  // Gets the users current location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setError(null);
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  
  };

  const [selectedRadius, setSelectedRadius] = useState(10); // Default radius: 10 km

  const handleRadiusChange = (newRadius) => {
    setSelectedRadius(newRadius);
  };

  return (
    <div className="app">
      {currentPage === 'home' && (
        <div className="home-prompt">
          <p className="question">Hungry?</p>
          <div className="button-container">
            <button onClick={handleNext} className="choice-button">Yes</button>
            <button onClick={handleNext} className="choice-button">Yes</button>
          </div>
        </div>
      )}
      
      {currentPage === 'question' && (
        <div className="home-prompt">
          <button onClick={getLocation}>Use your current location.</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {location.latitude && location.longitude && (
            <div>
              <p>Latitude: {location.latitude}</p>
              <p>Longitude: {location.longitude}</p>
            </div>
          )}
          <div>
          <p className="question">* Or tell us your postcode:</p>
            <input
              type="text"
              placeholder="Enter Victorian postcode"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
            />
            <button onClick={handleConvert}>Convert</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {coordinates.lat && coordinates.lng && (
              <div>
                <p>Latitude: {coordinates.lat}</p>
                <p>Longitude: {coordinates.lng}</p>
              </div>
            )}
            
          </div>
          <div className="app">
            <RadiusSlider onRadiusChange={handleRadiusChange} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
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
  const API_KEYS = {
    "maps": `${process.env.REACT_APP_MAPS_API}`
  }
  const [postcode, setPostcode] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });


  /**
   * Data relating to question
   * 
   * JSON Format:
   * {
   *  question: ...
   *  options: []
   * }
   * 
   */
  const [questionData, setQuestionData] = useState(null); // Stores question data

  /**
   * UseEffect to get question data from API
   */
  useEffect(() => {
    fetch('http://localhost:5000/example', {
      'methods': 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => setQuestionData(data))
      .catch(error => console.log(error))

  }, []) //in '[]' we can set when we make this get request?

  // Handle moving to the next page
  const handleNext = () => {
    setCurrentPage('question'); // Move from home to the question page
  };

  const handleConvert = async () => {
    console.log(typeof(API_KEYS))
    console.log("Maps API Key:", process.env.REACT_APP_MAPS_API);
    console.log("Environment Variables:", process.env); // Log all environment variables
    try {
      // Make a request to the Geocoding API
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${postcode},AU&key=${API_KEYS.maps}`
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
          <h1>Before we <br></br> jump in...</h1>
          <button onClick={getLocation}
          style={{
              background: "none",
              border: "none",
              padding: 0,
              font: "inherit",
              color: "black", // Customize the text color
              cursor: "pointer",
              textDecoration: "underline", // Optional: Add underline to make it look like a link
            }}
          >Use your current location.</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div>
          <div style={{ display: "flex", alignItems: "center" }}>
              <h1 style={{ margin: 0, marginRight: "10px" }}>Or tell us your postcode:</h1>
              <input
                type="text"
                placeholder="Enter Victorian postcode"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
              />
            </div>
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
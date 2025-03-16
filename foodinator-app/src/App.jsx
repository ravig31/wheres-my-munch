import React, { useState, useEffect } from 'react';
import './styles/global.css';
import './App.css';

// import ConfigPage from './components/ConfigPage'
import Question from './components/Question'
import APIService from './components/APIService';

import axios from 'axios';
import RadiusSlider from './components/RadiusSlider';


function App() {
  // State to track the current page/content
  const [currentPage, setCurrentPage] = useState('home'); // Can be 'home' or 'question'
  // const [currLocation, setLocation] = useState({});
  const [questionData, setQuestionData] = useState(null); // Stores question data
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);

  // State to track post code and coordinate  
  const API_KEYS = {
    "maps": `${process.env.REACT_APP_MAPS_API}`
  }
  const [postcode, setPostcode] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

  const handleConvert = async () => {
    console.log(typeof (API_KEY))
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


  const postLocation = () => {
    fetch("http://localhost:5000/initialPrompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ latitude: location.latitude, longitude: location.longitude }),
      mode: 'cors'
    })
      .then(response => response.json())
      .then(data => {
        console.log("Response from server:", data)
        setQuestionData(data);
        handleStartConvo();
      }
      ).catch(error => console.error("Error:", error));

    //nextStageFunction()
  }

  // Handle moving to the next page
  const handleNext = () => {
    setCurrentPage('config'); // Move from home to the question page
  };

  // Handle moving to the prompts page
  const handleStartConvo = () => {
    console.log("called")
    setCurrentPage("prompt"); // Move from home to the question page
  };

  const updatePrompt = (data) => {
    console.log(`This is the newest response data: ${data.question}`)
    setQuestionData(data);
  };

  useEffect(() => {
    console.log("Updated apiResponse:", questionData);
  }, [questionData]);

  const data = "Hey hope this works!"
  const testPost = () => {
    APIService.Tester({ data: "Hey hope this works!" });
  };

  return (
    <div className="app">
      {currentPage === 'home' && (
        <div className="home-prompt">
          <p className="question">Hungry?</p>
          <div className="button-container">
            <button onClick={testPost} className="choice-button">Yes</button>
            <button onClick={handleNext} className="choice-button">Yes</button>
          </div>
        </div>
      )}
      {currentPage === 'config' && (
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
            <button onClick={postLocation} className="start-convo-button">Continue to Choices</button>
          </div>
          <div className="app">
            <RadiusSlider onRadiusChange={handleRadiusChange} />
          </div>
        </div>
      )}
      {currentPage === 'prompt' && questionData && <Question question={questionData.response.question} options={questionData.response.options} />}
    </div>
  );
}

export default App;
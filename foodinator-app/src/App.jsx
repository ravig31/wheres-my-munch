import React, { useState, useEffect } from 'react';
import './styles/global.css';
import './App.css';

import ConfigPage from './components/ConfigPage'
import Question from './components/Question'

import BusinessCard from './components/BusinessCard';
import MapBox from './components/MapBox';
import logo from './assets/ascii-pizza.png';
import axios from 'axios';
import RadiusSlider from './components/RadiusSlider';

function App() {
  // State to track the current page/content
  const [currentPage, setCurrentPage] = useState('prompt'); 

  // State to track the current location
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);

  // State to track post code and coordinate  
  const [postcode, setPostcode] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

  // Sample response
  const suggestedRestaurant = {
    name: "YOMG Glen Waverley",
    address: "65-67 Kingsway, Glen Waverley VIC 3150",
    phone:"(03) 9560 2288",
    long: 145.163390,
    lat: -37.880307,
    link: "https://www.google.com/maps/dir//65-67+Kingsway,+Glen+Waverley+VIC+3150/@-37.8802503,145.0809441,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x6ad63fbf6266e217:0xa9b91d10a0c0e1ea!2m2!1d145.1633451!2d-37.880279?entry=ttu&g_ep=EgoyMDI1MDMxMi4wIKXMDSoASAFQAw%3D%3D",
    blurb: "We picked YOMG Glen Waverley for you because you were after something casual and sweet in the area. It’s got the perfect mix of loaded burgers, crispy fries, and, of course, their famous frozen yogurt. Whether you're craving a shake, a snack, or just a chill spot to hang out, YOMG’s got you covered."
  };

  const LongQuestion = {
    "question": "Choose one of the following optionsss I'm trying to make this question longer and longer and longer",
    "options": ["A quick and easy errand", "A leisurely stroll", "An exciting adventure", "A peaceful escape"]
  }

  const ShortQuestion = {
    "question": "How are you feeling?",
    "options": ["Happy", "Sad", "Confused", "Silly"]
  }

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
    setCurrentPage('config');
  };

    // Handle going from question -> result
    const handleResult = () => {
      setCurrentPage('result');
  };

     // Handle moving to the prompts page
    const handleStartConvo = () => {
    setCurrentPage("prompt"); // Move from home to the question page
      
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
      {currentPage === 'config' && <ConfigPage  nextStageFunction={handleStartConvo}/>}
      {currentPage === 'prompt' && <Question question={LongQuestion.question} options={LongQuestion.options} />}

      
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
            
          </div>
          <div className="app">
            <RadiusSlider onRadiusChange={handleRadiusChange} />
          </div>
        </div>
      )}

      {currentPage === 'result' && (
        <div class="container">
        <div className="result-page">
          <img src={logo} alt="Logo" className="result-logo" />
          <p>We've found your perfect <br></br> match!</p>
          <MapBox long={suggestedRestaurant.long} lat={suggestedRestaurant.lat} />
        <BusinessCard
          name={suggestedRestaurant.name}
          address={suggestedRestaurant.address}
          phone={suggestedRestaurant.phone}
          link={suggestedRestaurant.link}
        />
        <p className="result-description">({suggestedRestaurant.blurb})</p>
          {/* <p className="result-description">
          *{suggestedRestaurant.blurb}
          </p>

          <button onClick={handleNext}>Don't fw this? Keep searching</button> */}
        </div>
        </div>
      )}
    </div>
  );
}

export default App;
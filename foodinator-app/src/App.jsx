import React, { useState, useEffect } from 'react';
import './styles/global.css';
import './App.css';

// import ConfigPage from './components/ConfigPage'
import Question from './components/Question'

import BusinessCard from './components/BusinessCard';
import MapBox from './components/MapBox';
import logo from './assets/ascii-icespice.png';
import axios from 'axios';
import RadiusSlider from './components/RadiusSlider';

import axios from 'axios';
import RadiusSlider from './components/RadiusSlider';


function App() {
  // State to track the current page/content
  const [currentPage, setCurrentPage] = useState('home'); // Can be 'home' or 'question'

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
    setCurrentPage('config');
  };

    // Handle going from question -> result
    const handleResult = () => {
      setCurrentPage('result');
  };

  // Handle moving to the prompts page
  const handleStartConvo = () => {
    console.log("called")
    setCurrentPage("prompt"); // Move from home to the question page
  };

  const updatePrompt = (data) => {
    console.log(data.response)
    if ("answer" in data.response){
        console.log(`The answer is: ${data.response}`)
        setCurrentPage('config')
    }
    else{
      setQuestionData(data);
    }
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
      {currentPage === 'question' && <ConfigPage  nextStageFunction={handleStartConvo}/>}
      {currentPage === 'test' && questionData && <Question  question={questionData.question} options={questionData.options}/>}

    </div>
  );
}

export default App;
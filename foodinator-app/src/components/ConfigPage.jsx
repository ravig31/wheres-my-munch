import React, { useState } from 'react';
import axios from 'axios';
import RadiusSlider from './RadiusSlider';


const ConfigPage = ({ nextStageFunction }) => {
    // State to track the current location
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [error, setError] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [postcode, setPostcode] = useState(null);
    const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
    const [selectedRadius, setSelectedRadius] = useState(10); // Default radius: 10 km

    const [useCurrentLocation, setUseCurrentLocation] = useState(false);
    
    // State to track post code and coordinate  
    const API_KEYS = {
        "maps": `${process.env.REACT_APP_MAPS_API}`
    }
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


    // Changes radius based on slider
    const handleRadiusChange = (newRadius) => {
        setSelectedRadius(newRadius);
    };
    
    const postLocation = () => {
        fetch("http://118.138.114.203:5000/initialPrompt/test", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ latitude:location.latitude ,longitude:location.longitude }),
        })
            .then(response => response.json())
            .then(data => console.log("Response from server:", data))
            .catch(error => console.error("Error:", error));
        
        nextStageFunction()
    }

    const handlePostcodeChange = (e) => {
        setPostcode(e.target.value);
        setUseCurrentLocation(false); // Deselect current location
        setError("");
      };

    
      const fetchCoordinatesFromPostcode = async () => {
        if (!postcode) return;
        const apiKey = {
            "maps": `${process.env.REACT_APP_MAPS_API}`
        }
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${postcode}&key=${apiKey}`;
    
        try {
          const response = await fetch(url);
          const data = await response.json();
          if (data.results.length > 0) {
            const location = data.results[0].geometry.location;
            setCoordinates({ lat: location.lat, lng: location.lng });
        } else {
            setError("Invalid postcode. Please try again.");
          }
        } catch (error) {
          setError("Error fetching location data.");
        }
      };

    return (
        <div className="location-page">
            <div className="location-container">
                <p className="title-text">Before we <br></br> jump in...</p>
                <p className="locationq-text">
                    <span
                        className="location-link"
                        onClick={getLocation}
                    >
                        Use current location
                    </span>
                </p>
                <div className="postcode-container">
                    <p className="locationq-text">Or tell us your post code:</p>
                    <div className="inline-input-wrapper">
                        <input
                            type="text"
                            value={postcode}
                            onChange={handlePostcodeChange}
                            onBlur={fetchCoordinatesFromPostcode}
                            disabled={useCurrentLocation}
                            placeholder="____"
                            className="postcode-input-inline"
                        />
                    </div>
                </div>
                {error && <p className="error-text">{error}</p>}

                <div className="range-container">
                    <label>How far do you want to travel?</label>
                    <input
                        type="range"
                        min="5"
                        max="50"
                        value={selectedRadius}
                        onChange={(e) => setSelectedRadius(e.target.value)}
                        className="range-slider"
                    />
                    <p>Radius: {selectedRadius} km</p>
                </div>

                <button onClick={postLocation} className="start-convo-button">Continue to choices</button>
            </div>
        </div>

    )
}

export default ConfigPage;
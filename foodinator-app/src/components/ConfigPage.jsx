import React, { useState } from 'react';
import axios from 'axios';
import RadiusSlider from './RadiusSlider';
import "../styles/Config.css"; 


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


    

    return (
        <div className="location-page">
            <div className="location-container">
                <div class='title-container'>
                    <p className="title-text">Before we <br></br> jump in...</p>
                </div>
                <p className="locationq-text">
                    <span
                        className="location-link"
                        onClick={getLocation}
                    >
                        Use current location
                    </span>
                </p>

                {error && <p className="error-text">{error}</p>}
                {/* Slider Section */}
                <div className="range-container">
                    <RadiusSlider onRadiusChange={handleRadiusChange} />
                </div>
                <div class='start-convo-container'>
                  <button onClick={postLocation} className="start-convo-button">Continue to choices</button>
                </div>
            </div>
        </div>

    )
}

export default ConfigPage;
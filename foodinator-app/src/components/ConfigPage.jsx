import React, { useState } from 'react';
import axios from 'axios';
import RadiusSlider from './RadiusSlider';


const ConfigPage = ({ nextStageFunction }) => {
    // State to track the current location
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [error, setError] = useState(null);

    // State to track post code and coordinate  
    const API_KEYS = {
        "maps": `${process.env.REACT_APP_MAPS_API}`
    }
    const [postcode, setPostcode] = useState(null);
    const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

    const handleConvert = async () => {
        console.log(typeof (API_KEYS.maps)) // Added .maps to correctly log the key type
        try {
            // Make a request to the Geocoding API
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${postcode},AU&key=${API_KEYS.maps}`
            );

            // Extract latitude and longitude from the response
            const { lat, lng } = response.data.results[0].geometry.location;

            // Update state with the coordinates
            setLocation({ latitude: lat, longitude: lng }); // Update location state
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
        // Use the location state for the POST request, which is updated either by getLocation or handleConvert
        fetch("http://localhost:5001/initialPrompt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ latitude: location.latitude, longitude: location.longitude, radius: selectedRadius }), // Include radius
            mode: "cors"
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                nextStageFunction(); // Move nextStageFunction() inside the .then() to ensure it only runs after a successful POST
            })
            .catch(error => console.error("Error:", error));

    }

    return (
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

                {/* This section might not be needed now that handleConvert updates 'location' */}
                {/* {coordinates.lat && coordinates.lng && (
                    <div>
                        <p>Latitude: {coordinates.lat}</p>
                        <p>Longitude: {coordinates.lng}</p>
                    </div>
                )} */}
                <div className="app">
                    <RadiusSlider onRadiusChange={handleRadiusChange} />
                </div>
                <button onClick={postLocation} className="start-convo-button">Continue to Choices</button>
            </div>

        </div>
    )
}

export default ConfigPage;
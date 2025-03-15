import React, { useState } from 'react';
import './styles/global.css';
import './App.css';

function App() {
  // State to track the current page/content
  const [currentPage, setCurrentPage] = useState('home'); // Can be 'home' or 'question'

  const [currentLocation, setLocation] = useState('no');

  // Handle moving to the next page
  const handleNext = () => {
    setCurrentPage('question'); // Move from home to the question page
  };

  // Handle location, between currentLocation and pick a postcode
  const handleLocation = () => {
    setLocation('yes')
  }

  return (
    <div className="app">
      {currentPage === 'home' && (
        <div className="home-page">
          <h1>Welcome to Foodinator!</h1>
          <p>Find the best restaurants near you.</p>
          <button onClick={handleNext}>Yes</button>
          <button onClick={handleNext}>Yes</button>
        </div>
      )}

      {currentPage === 'question' && (
        <div className="question-page">
          <h1>Question Page</h1>
          <button onClick={handleLocation}>Use your current location.</button>

        </div>
      )}
    </div>
  );
}

export default App;
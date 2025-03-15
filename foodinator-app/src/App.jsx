import React, { useState } from 'react';
import './styles/global.css';
import './App.css';

function App() {
  // State to track the current page/content
  const [currentPage, setCurrentPage] = useState('home'); // Can be 'home' or 'question'
  const [currentLocation, setLocation] = useState('no');

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
  const [questionData, setQuestionData] = useState(null); //

  /**
   * UseEffect to get question data from API
   */
  useEffect(()=>{
    fetch('http://localhost:5000/example',{
      'methods':'GET',
      headers : {
        'Content-Type':'application/json'
      }
    })
    .then(response => response.json())
    .then(response => setQuestionData(response))
    .catch(error => console.log(error))

  },[]) //in '[]' we can set when we make this get request?

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
import React, { useState, useEffect } from 'react';
import './styles/global.css';
import './App.css';

import ConfigPage from './components/ConfigPage'
import Question from './components/Question'



function App() {
  // State to track the current page/content
  const [currentPage, setCurrentPage] = useState('home'); // Can be 'home' or 'question'


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

   // Handle moving to the prompts page
   const handleStartConvo = () => {
    setCurrentPage("test"); // Move from home to the question page
    
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
      {currentPage === 'question' && <ConfigPage  nextStageFunction={handleStartConvo}/>}
      {currentPage === 'test' && questionData && <Question  question={questionData.question} options={questionData.options}/>}

    </div>
  );
}

export default App;
import React from "react";

const ButtonList = ({ items, updaterF }) => {
  const handleClick = (option) => {
    console.log("button click test")
    fetch("http://localhost:5000/processSelection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ selectedOption: option }),
      mode: 'cors'
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("attempting to display next prompt:")
        console.log(`Connection Dones: ${data.response.question}`)
        updaterF(data)
      })
      .catch((error) => console.error("Error:", error));
  };

  // Separate buttons into left and right groups
  const leftButtons = items.filter((_, index) => index % 2 === 0);
  const rightButtons = items.filter((_, index) => index % 2 !== 0);

  return (
    <div className="question-buttons-list">
      <div className="left-column">
        {leftButtons.map((item, index) => (
          <button
            key={`left-${index}`}
            className="dynamic-button align-left"
            onClick={() => handleClick(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="right-column">
        {rightButtons.map((item, index) => (
          <button
            key={`right-${index}`}
            className="dynamic-button align-right"
            onClick={() => handleClick(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ButtonList;

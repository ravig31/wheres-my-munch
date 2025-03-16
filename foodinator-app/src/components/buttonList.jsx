import React from "react";

const ButtonList = ({ items }) => {

    // Function to handle button click and send data to Flask
    // TODO: Change and test the dummy request
    // const handleClick = (option) => {
    //     console.log("button click test")
    //     // fetch("http://localhost:5000/submit", {
    //     //     method: "POST",
    //     //     headers: {
    //     //         "Content-Type": "application/json",
    //     //     },
    //     //     body: JSON.stringify({ selectedOption: option }),
    //     // })
    //     //     .then(response => response.json())
    //     //     .then(data => console.log("Response from server:", data))
    //     //     .catch(error => console.error("Error:", error));
    // };

    return (
        
        <div className="question-buttons-list">
            {items.map((item, index) => (
                <button key={index} className="dynamic-button">
                    {item}
                </button>
            ))}
        </div>
    );
};

export default ButtonList;
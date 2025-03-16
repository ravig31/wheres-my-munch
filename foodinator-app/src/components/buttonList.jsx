import React from "react";

const ButtonList = ({ items , updaterF }) => {

    // Function to handle button click and send data to Flask
    // TODO: Change and test the dummy request
    const handleClick = (option) => {
        console.log("button click test")
        fetch("http://localhost:5001/processSelection", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ selectedOption: option }),
            mode: 'cors'
        })
            .then(response => response.json())
            .then(data => {
                console.log("attempting to display next prompt:")
                console.log(`Connection Dones: ${data.response.question}`)
                updaterF(data)
            })
            .catch(error => console.error("Error:", error));
    };

    return (
        
        <div className="question-buttons-list">
            {items.map((item, index) => (
                <button key={index} className="dynamic-button" onClick={() => handleClick(item)}>
                    {item}
                </button>
            ))}
        </div>
    );
};

export default ButtonList;
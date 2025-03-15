import React from "react";

const ButtonList = ({ items }) => {

    return (
        <div className="button-list">
            {items.map((item, index) => (
                <button key={index} className="dynamic-button">
                    {item}
                </button>
            ))}
        </div>
    );
};

export default ButtonList;
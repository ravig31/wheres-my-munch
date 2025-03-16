// src/components/BusinessCard.jsx
import React from "react";
import "../styles/BusinessCard.css"; 

function BusinessCard({ name, address, phone, link}) {
  return (
    <div className="business-card">
      <h1>{name}</h1>
      <a href={link} target="_blank" rel="noopener noreferrer" className="business-card-address">{address}</a>
      <p>{phone}</p>
    </div>
  );
}

export default BusinessCard;

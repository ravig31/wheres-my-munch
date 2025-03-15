// src/components/BusinessCard.jsx
import React from "react";
import "../styles/BusinessCard.css"; // Create a separate CSS file for styling

function BusinessCard({ name, openTime, closeTime, address, phone, link }) {
  return (
    <div className="business-card">
      <h1>{name}</h1>
      <p>Open {openTime} to {closeTime} today</p>
      <a href={link} target="_blank" rel="noopener noreferrer" className="business-card-address">{address}</a>
      <div className="phone">{phone}</div>
    </div>
  );
}

export default BusinessCard;

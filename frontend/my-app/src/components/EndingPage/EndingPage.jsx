import React, { useState, useEffect } from "react";
import "./EndingPage.css";
import { Link } from "react-router-dom";

const EndingPage = () => {
  const [bullets, setBullets] = useState([]); // State to store fetched summary
  const [error, setError] = useState(null); // State to handle errors

  // Fetch the summary when the component mounts
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch("http://localhost:8000/summary", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonResponse = await response.json();

        // Check if the response has a valid 'bullets' array
        if (jsonResponse && Array.isArray(jsonResponse.bullets)) {
          setBullets(jsonResponse.bullets); // Update state with fetched bullets
        } else {
          throw new Error("Invalid JSON structure");
        }
      } catch (error) {
        console.error("Error fetching summary:", error);
        setError(error.message); // Set the error state
      }
    };

    fetchSummary(); // Call the function to fetch summary on mount
  }, []); // Empty dependency array to ensure it runs only once

  return (
    <div className="ending-container">
      <div className="left-side">
        <h2 className="presentify">PRESENTIFY</h2>
        <h1 className="ending-header">Great</h1>
        <h1 className="ending-header">Presentation!</h1>
        <br />
        <br />
        <br />
        <Link to="/">
          <button className="return-button" type="button">
            RETURN TO HOMEPAGE
          </button>
        </Link>
      </div>
      <div className="right-side">
        <div className="overlay-image">
          <div className="summary">
            <h3>Summary</h3>
            <ul>
              {/* Display either error, loading state, or fetched summary */}
              {error ? (
                <li>Error: {error}</li>
              ) : bullets.length > 0 ? (
                bullets.map((bullet, index) => <li key={index}>{bullet}</li>)
              ) : (
                <li>Loading summary...</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndingPage;

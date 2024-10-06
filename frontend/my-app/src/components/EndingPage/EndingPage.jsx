import React, { useState, useEffect } from "react";
import "./EndingPage.css";
import { Link } from "react-router-dom";

const EndingPage = () => {
  const [bullets, setBullets] = useState([]); // State to store fetched summary

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
        console.log("Summary fetched:", jsonResponse);

        // Assuming the response contains an array of bullet points under `bullets`
        setBullets(jsonResponse.bullets || []); // Update state with fetched bullets
      } catch (error) {
        console.error("Error fetching summary:", error);
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
              {/* Map through the bullets and render each as a list item */}
              {bullets.length > 0 ? (
                bullets.map((bullet, index) => <li key={index}>{bullet}</li>)
              ) : (
                <li>Loading summary...</li> // Fallback while fetching
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndingPage;

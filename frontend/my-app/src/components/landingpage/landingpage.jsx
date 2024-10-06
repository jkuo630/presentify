import React from "react";
import "./LandingPage.css";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div>
      <div className="landing-container">
        <div className="overlay-image">
          <div className="landing-logo-text">
            <h1 className="landing-header">PRESENTIFY</h1>
            <h2 className="landing-body">Live Generated Presentations </h2>
          </div>
          <Link to="/InstructionPage">
            <button class="next-button" type="submit">
              START
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

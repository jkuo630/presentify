import React from "react";
import "./landingpage.css";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div>
      <div className="landing-container">
        <h1 className="landing-header">Title</h1>
        <div className="landing-body">Text </div>
        <Link to="/PresentationPage">
          <button type="submit">Start</button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;

import React from "react";
import "./endingpage.css";
import { Link } from "react-router-dom";

const EndingPage = () => {
  return (
    <div className="ending-container">
      <div className="left-side">
        <h2 className="presentify">PRESENTIFY</h2>
        <h1 className="ending-header">Great </h1>
        <h1 className="ending-header">Presentation!</h1>
        <br></br>
        <br></br>
        <br></br>
        <Link to="/">
          <button className="return-button" type="button">
            RETURN TO HOMEPAGE
          </button>
        </Link>
      </div>
      <div className="right-side">
        <div className="overlay-image"></div>
      </div>
    </div>
  );
};

export default EndingPage;

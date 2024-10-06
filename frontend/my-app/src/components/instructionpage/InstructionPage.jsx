import "./InstructionPage.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDrum,
  faHandPaper,
  faBug,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";

const useSpeechRecognition = () => {
  const [recognizedText, setRecognizedText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [listening, setListening] = useState(false);
  const recognition = useRef(null);

  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      console.error("Speech Recognition not supported in this browser");
      return;
    }

    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;
    recognition.current = new SpeechRecognition();
    recognition.current.continuous = true;
    recognition.current.interimResults = true;
    recognition.current.lang = "en-US";

    recognition.current.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript.trim() + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      setInterimText(interimTranscript);
      setRecognizedText(finalTranscript);
    };

    recognition.current.onerror = (event) => {
      console.error("Speech recognition error: ", event.error);
      setListening(false);
    };

    return () => {
      recognition.current.stop();
    };
  }, []);

  const startListening = () => {
    setListening(true);
    recognition.current.start();
  };

  const stopListening = () => {
    setListening(false);
    recognition.current.stop();
  };

  return {
    recognizedText,
    interimText,
    listening,
    startListening,
    stopListening,
  };
};

function InstructionPage() {
  const { recognizedText, interimText, startListening, stopListening } =
    useSpeechRecognition();

  const [presentationStarted, setPresentationStarted] = useState(false);

  const startPresentation = () => {
    setPresentationStarted(true); // Set to true when the button is clicked
  };

  // Dynamic bullet points state
  const [bulletPoints, setBulletPoints] = useState([
    "Bullet point 1",
    "Bullet point 2",
    "Bullet point 3",
  ]);

  const [currentBulletIndex, setCurrentBulletIndex] = useState(0);

  // Function to handle next bullet point
  const nextBulletPoint = () => {
    if (currentBulletIndex < bulletPoints.length - 1) {
      setCurrentBulletIndex(currentBulletIndex + 1);
    }
  };

  // Function to reset or clear the bullet points
  const clearBulletPoints = () => {
    setCurrentBulletIndex(0);
  };

  return (
    <div className="presentation-container">
      {!presentationStarted && (
        <>
          <h1>PRESENTIFY</h1>
          <div className="content">
            <div className="instructions">
              <h2>
                How to Use <id id="logo">PRESENTIFY</id>
              </h2>
              <br></br>
              <p>Presentations have never been easier.</p>
              <br></br>
              <p>
                Images, captions, and bullet points will generate as you speak.
              </p>
              <br></br>
              <p>
                Press your <b>left arrow</b> to go to your next bullet point.
                Press your
                <b> right arrow </b> key to clear a slide.{" "}
              </p>
              <br></br>
              <button
                onClick={() => {
                  startListening();
                  startPresentation();
                }}
              >
                START PRESENTATION
              </button>
            </div>

            <div className="sound-queues">
              <h3>SOUND QUEUES</h3>
              <br></br>
              <div className="sound-queue-toggle">
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider round"></span>
                </label>
              </div>
              <span>Enable keyword sound effect queuing.</span>
              <ul>
                <li>
                  <span className="icon">
                    <FontAwesomeIcon icon={faDrum} />
                  </span>
                  <strong>“Drum roll Please”</strong>
                  <p>Drum roll effect</p>
                </li>
                <li>
                  <span className="icon">
                    <FontAwesomeIcon icon={faHandPaper} />
                  </span>
                  <strong>“Thank You”</strong>
                  <p>Clapping effect</p>
                </li>
                <li>
                  <span className="icon">
                    <FontAwesomeIcon icon={faBug} />
                  </span>
                  <strong>“Crickets”</strong>
                  <p>Cricket effect</p>
                </li>
                <li>
                  <span className="icon">
                    <FontAwesomeIcon icon={faStar} />
                  </span>
                  <strong>“Yay”</strong>
                  <p>Cheering effect</p>
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
      {presentationStarted && (
        <div className="middle-row">
          <img
            src="https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/1966.png"
            alt="Presentation"
            className="presentation-image"
          />
          <ul className="bullet-points">
            {bulletPoints
              .slice(0, currentBulletIndex + 1)
              .map((bullet, index) => (
                <li key={index}>{bullet}</li>
              ))}
          </ul>
        </div>
      )}

      <div className="live-subtitles">
        <pre>
          {recognizedText} {interimText}
        </pre>
      </div>
      <a href="#" className="finish-presentation-link" onClick={stopListening}>
        FINISH PRESENTATION
      </a>
    </div>
  );
}

export default InstructionPage;

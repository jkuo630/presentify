import "./PresentationPage.css";
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

function PresentationPage() {
  const { recognizedText, interimText, startListening, stopListening } =
    useSpeechRecognition();

  return (
    <div className="presentation-container">
      <h1>PRESENTIFY</h1>
      <div className="content">
        <div className="instructions">
          <h2>
            How to Use <id id="logo">PRESENTIFY</id>
          </h2>
          <br></br>
          <p>This is a bullet point.</p>
          <br></br>
          <p>This is also a bullet point.</p>
          <br></br>
          <p>This is yet another bullet point.</p>
          <br></br>
          <button onClick={startListening}>START PRESENTATION</button>
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

export default PresentationPage;

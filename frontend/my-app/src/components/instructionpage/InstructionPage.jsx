import "./instructionpage.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDrum,
  faHandPaper,
  faBug,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import Subtitle from "../Subtitle";

let sentenceArray = [];

export function useWebSpeechAPI({ onResult }) {
  const [listening, setListening] = useState(false);
  const recognition = useRef(null);

  const [interimText, setInterimText] = useState("");
  const [recognizedText, setRecognizedText] = useState("");


  useEffect(() => {
    // Check if the browser supports the Web Speech API
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition.current = new SpeechRecognition();

    // Enable continuous recognition and interim results (for real-time subtitles)
    recognition.current.continuous = true;
    recognition.current.interimResults = true;
    recognition.current.lang = 'en-US'; // Set recognition language to English

    // Event listener for when the speech recognition gets results
    recognition.current.onresult = (event) => {
      // Transcript of the latest recognized result
      const result = event.results[event.results.length - 1][0].transcript;

      // Variables to store final and interim transcripts separately
      let interimTranscript = '';
      let finalTranscript = '';

      // Loop through the event results to separate interim and final transcripts
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        // If the result is finalized (pause detected), add to finalTranscript
        if (event.results[i].isFinal) {
          finalTranscript += transcript.trim() + " "; // Sentence boundary detected
        } else {
          interimTranscript += transcript; // Still processing (for real-time subtitles)
        }
      }

      // Update state for real-time subtitles with interim results
      setInterimText(interimTranscript);
      // Update state for final sentences (used to generate bullet points)
      setRecognizedText(finalTranscript);

      // Callback to handle the finalized sentence (e.g., to send to backend or process)
      onResult(finalTranscript);
    };

    // Handle speech recognition errors (e.g., no mic access)
    recognition.current.onerror = (event) => {
      console.error("Speech recognition error", event);
      setListening(false); // Stop listening on error
    };

    // Cleanup function to stop recognition when component unmounts
    return () => {
      recognition.current.stop();
    };
  }, []); // Empty dependency array to ensure this effect runs only once on component mount

  // Function to start speech recognition
  const start = () => {
    setListening(true); // Update state to indicate that listening has started
    recognition.current.start(); // Start the Web Speech API
  };

  // Function to stop speech recognition
  const stop = () => {
    setListening(false); // Update state to indicate that listening has stopped
    recognition.current.stop(); // Stop the Web Speech API
  };

  return { listening, interimText, recognizedText, start, stop }; // Return necessary variables and functions
}


function InstructionPage() {
  // const { recognizedText, interimText, startListening, stopListening } = useSpeechRecognition();
  const [imageUrl, setImageUrl] = useState(null);
  const [text, setText] = useState("");
  const [bulletPoints, setBulletPoints] = useState([]);

  const {
    listening: webListening,
    interimText,
    recognizedText,
    start,
    stop,
  } = useWebSpeechAPI({
    onResult: (result) => {
      setText((prevText) => (result.length >= 1 ? result + ' ' : ''));
    }
  });

  useEffect(() => {
    fetchStuff({ words: text, bullets: bulletPoints });
    // setBulletPoints
    console.log(text);
    // Function to handle the keydown event
    const handleKeyDown = (event) => {
      // Check if the right arrow key (keyCode 39) is pressed
      if (event.keyCode === 39) {
        clearStates();
        // Clear the imageUrl and bulletPoints when right arrow key is pressed
        setImageUrl(null); // Reset imageUrl to null
        setBulletPoints([]); // Reset bulletPoints to an empty array

        console.log("Right arrow key pressed. Image and bullets cleared.");
      }
    };

    // Attach the event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [text]);

  async function fetchStuff(presentationInfo) {
    try {
      const data = await fetchHeaderAndBullet(presentationInfo);
      if (data.image !== "marcuskam") {
        setImageUrl(data.image);
      }
      setBulletPoints(data.bullets);
    } catch (error) {
      console.error(error);
    }

  }

  const [presentationStarted, setPresentationStarted] = useState(false);

  const startPresentation = () => {
    setPresentationStarted(true); // Set to true when the button is clicked
  };

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
                  start();
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
        <>
          <h1>PRESENTIFY</h1>
          <div className="middle-row">
            {imageUrl ?
              <img
                src={imageUrl}
                alt="Presentation"
                className="presentation-image"
              />
              :
              <div></div>}
            <ul className="bullet-points">
              {bulletPoints?.map((bullet, index) => (
                  <li className="bullet-points" key={index}>{bullet}</li>
                ))}
            </ul>
          </div>
        </>
      )}

      <div className="live-subtitles">
        <Subtitle recognizedText={recognizedText} interimText={interimText} />
      </div>
      <Link to="/EndingPage">
        <a
          href="#"
          className="finish-presentation-link"
          onClick={stop}
        >
          FINISH PRESENTATION
        </a>
      </Link>
    </div>
  );
}


async function clearStates() {
  try {
    const response = await fetch("http://localhost:8000/clear", {
      method: "GET",
      headers: {
        "Content-Type": "application/json" // Not strictly necessary for GET requests
      }
    });

    // Check if the response is ok (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // Assuming the response is JSON
    console.log(data); // Process the response data as needed
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function fetchHeaderAndBullet(presentationInfo) {
  if (presentationInfo.words) {
    console.log("fetching");
    sentenceArray.push(presentationInfo.words);

    const textJson = { id: sentenceArray.length, words: presentationInfo.words, bullets: presentationInfo.bullets };

    try {
      const response = await fetch("http://localhost:8000/words", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(textJson)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const jsonResponse = await response.json();
      console.log("response received");
      console.log(jsonResponse);
      return jsonResponse; // Return the response
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Re-throw the error if needed
    }
  } else {
    console.warn("No text provided");
    throw new Error("No text provided"); // Throw an error if no text
  }
}

export default InstructionPage;

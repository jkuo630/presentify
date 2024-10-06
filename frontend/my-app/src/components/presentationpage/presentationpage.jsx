import "./PresentationPage.css";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Subtitle from "../Subtitle";
import {
  faDrum,
  faHandPaper,
  faBug,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

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

function PresentationPage() {
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
  }, [text, bulletPoints]);

  async function fetchStuff(presentationInfo) {
    try {
      const data = await fetchHeaderAndBullet(presentationInfo);
      setImageUrl(data.image);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
    
  }

  const startBoth = () => {
    // startListening();
    start();
  };

  return (
    <div className="presentation-container">
      <h1>PRESENTIFY</h1>
      <div className="content">
        {imageUrl?
        <img
        src={imageUrl}
        width={300}
        alt="Description of the image" // Always good to include an alt attribute
      /> :
      <div> </div>
        }
        
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
          <button onClick={start}>START PRESENTATION</button>
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
        <Subtitle recognizedText={recognizedText} interimText={interimText} />
      </div>
      <a href="#" className="finish-presentation-link" onClick={stop}>
        FINISH PRESENTATION
      </a>
    </div>
  );
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

export default PresentationPage;


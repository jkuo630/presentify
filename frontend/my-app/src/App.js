import './App.css';
import Subtitle from './components/Subtitle';

import { useState, useEffect, useRef } from 'react';

const useSpeechRecognition = () => {
  const [recognizedText, setRecognizedText] = useState('');
  const [interimText, setInterimText] = useState('');
  const [listening, setListening] = useState(false);
  const recognition = useRef(null);
  const [allText, setAllText] = useState("");

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      console.error("Speech Recognition not supported in this browser");
      return;
    }
  
    // Keydown event listener
    const handleKeyDown = async (event) => {
      if (event.key === "ArrowRight") {
        const concatenatedText = `${recognizedText} ${interimText}`.trim();
        if (concatenatedText.length > 0) {
          try {
            console.log("sending words");
            const response = await fetch("http://localhost:8000/words", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ text: concatenatedText }),
            });
  
            if (!response.ok) {
              throw new Error("Failed to send the text");
            }
  
            setAllText(prevText => prevText + " " + concatenatedText);
            setRecognizedText(""); // Clear recognized text
            setInterimText(""); // Clear interim text
  
            console.log("Text sent successfully:", concatenatedText);
          } catch (error) {
            console.error("Error sending text:", error);
          }
        }
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
  
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    recognition.current = new SpeechRecognition();
    recognition.current.continuous = true;
    recognition.current.interimResults = true;
    recognition.current.lang = 'en-US';
  
    recognition.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
  
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript.trim() + ' ';
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
      window.removeEventListener("keydown", handleKeyDown);
      recognition.current.stop();
    };
  }, [recognizedText, interimText]); // Add recognizedText and interimText as dependencies
  

  const startListening = () => {
    setListening(true);
    recognition.current.start();
  };

  const stopListening = () => {
    setListening(false);
    recognition.current.stop();
  };

  return { recognizedText, interimText, listening, startListening, stopListening };
};



function App() {

  const {recognizedText, interimText, listening, startListening, stopListening} = useSpeechRecognition();

  return (
    <div className="App">
      <header className="App-header">
        {/* Image Component will go here */}
        <button onClick={startListening}>Start Listening</button>
        <p>{listening ? 'Listening' : "Not Listening"}</p>
        <Subtitle recognizedText={recognizedText} interimText={interimText} />
        <button onClick={stopListening}>Stop Listening</button>
      </header>
    </div>
  );
}

export default App;

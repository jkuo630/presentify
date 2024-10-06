import LandingPage from './components/LandingPage/LandingPage';
import './App.css';
import ImageDisplay from './components/Image';
import Subtitle from './components/Subtitle';

import { useState, useEffect, useRef } from 'react';

const useSpeechRecognition = () => {
  const [recognizedText, setRecognizedText] = useState('');
  const [interimText, setInterimText] = useState('');
  const [listening, setListening] = useState(false);
  const recognition = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      console.error("Speech Recognition not supported in this browser");
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    recognition.current = new SpeechRecognition();
    recognition.current.continuous = true;
    recognition.current.interimResults = true; // Enable interim results
    recognition.current.lang = 'en-US';

    recognition.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      // Loop through results to handle interim and final results
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

  return { recognizedText, interimText, listening, startListening, stopListening };
};



function App() {
  return (
    <div>
      <LandingPage />
      <div className="App">
        <header className="App-header">
          <button onClick={startListening}>Start Listening</button>
          <p>{listening ? 'Listening' : "Not Listening"}</p>
          <Subtitle recognizedText={recognizedText} interimText={interimText} />
          <button onClick={stopListening}>Stop Listening</button>
        </header>
        <ImageDisplay />
      </div>
      </div>
      );
}

      export default App;
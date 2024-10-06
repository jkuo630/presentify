import "./presentationpage.css";

import { useState, useEffect, useRef } from "react";

let sentenceArray = [];

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

export function useWebSpeechAPI({ onResult }) {
  const [listening, setListening] = useState(false);

  const SpeechRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  SpeechRecognition.continuous = true;
  SpeechRecognition.lang = 'en-US';
  SpeechRecognition.interimResults = false;
  // SpeechRecognition.maxAlternatives = 1;

  SpeechRecognition.onresult = (event) => {
    const result = event.results[event.results.length - 1][0].transcript;
    onResult(result);
  };

  SpeechRecognition.onerror = (event) => {
    console.error('Speech recognition error', event);
    setListening(false);
  };

  return {
    listening,
    start: () => { SpeechRecognition.start(); setListening(true); },
    stop: () => { setListening(false); SpeechRecognition.stop(); },
  };
}


function PresentationPage() {
  // const {
  //   recognizedText,
  //   interimText,
  //   listening,
  //   startListening,
  //   stopListening,
  // } = useSpeechRecognition();

  const [text, setText] = useState("");

  const { listening, start, stop } = useWebSpeechAPI({
    onResult: (result) => {
      setText((result.length >= 1) ? text + result : text);
    }
  });


  useEffect(() => {
    // everytime text is logged, and is not null, send a post request to backend
    // - should include: current bullet points, and current sentence
    // backend will make openai call -> images api
    // - should return keywords, and updated bullet points
    // - json format, and access on frontend.
    fetchHeaderAndBullet(text);
    console.log(text);
  }, [text]);

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={start}>Start Listening</button>
        <p>{listening ? "Listening" : "Not Listening"}</p>
        <pre>
          {/* {recognizedText} {interimText} */}
          {text}
        </pre>
        <button onClick={stop}>Stop Listening</button>
      </header>
    </div>
  );
}

function fetchHeaderAndBullet(text) {
  if (text) {
    console.log("fetching");
    sentenceArray.push(text);

    const textJson = { id: sentenceArray.length, words: text };
    fetch("http://localhost:8000/words", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(textJson) // Send the object directly if this is what your server expects
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((jsonResponse) => {
      console.log(jsonResponse);
    })
    .catch((error) => {
      console.error("Error fetching data:", error); // Log any errors that occur
    });
  } else {
    console.warn("No text provided"); // Optional: log if no text was provided
  }
}

export default PresentationPage;

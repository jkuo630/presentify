import cheeringSound from './sounds/cheering.mp3';
import clappingSound from './sounds/clapping.mp3';
import cricketSound from './sounds/crickets.mp3';
import drumrollSound from './sounds/drumroll.mp3';
import React, { useEffect } from "react";


function Subtitle(props) {
  useEffect(() => {
    if (props.recognizedText.includes("yay")) {
        console.log("Playing audio");
        const audio = new Audio(cheeringSound);
        audio.play().catch((error) => {
            console.error("Error playing audio:", error);
        });
    }
    if (props.recognizedText.includes("crickets")) {
      console.log("Playing audio");
      const audio = new Audio(cricketSound);
      audio.play().catch((error) => {
          console.error("Error playing audio:", error);
      });
    }
    if (props.recognizedText.includes("thank you")) {
      console.log("Playing audio");
      const audio = new Audio(clappingSound);
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
    if (props.recognizedText.includes("drum roll please")) {
      console.log("Playing audio");
      const audio = new Audio(drumrollSound);
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  }, [props.recognizedText]); // Depend on recognizedText

  return (
    <div className="container">
        <pre>{props.recognizedText} {props.interimText}</pre>
    </div>
  );
}

export default Subtitle;

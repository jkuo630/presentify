
function Subtitle(props) {

  return (
    <div className="container">
        <pre>{props.recognizedText} {props.interimText}</pre>
    </div>
  );
}

export default Subtitle;

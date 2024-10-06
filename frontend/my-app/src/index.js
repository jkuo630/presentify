import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import InstructionPage from "./components/instructionpage/InstructionPage"
import EndingPage from "./components/EndingPage/EndingPage";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import PresentationPage from "./components/presentationpage/presentationpage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/instructionpage" element={<InstructionPage />} />
      <Route path="/presentationpage" element={<PresentationPage />} />
      <Route path="/endingpage" element={<EndingPage />} />
    </Routes>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

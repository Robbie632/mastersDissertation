import "../styles/lesson.css";
import "../App.css";
import React, { useState } from "react";

export default function Lesson({ name }) {
  const phrasePairs = [
    { l1: "phrase 1a", l2: "phrase 1b", phraseid: "0" },
    { l1: "phrase 2a", l2: "phrase 2b", phraseid: "1" },
    { l1: "phrase 3a", l2: "phrase 3b", phraseid: "2" },
    { l1: "phrase 4a", l2: "phrase 4b", phraseid: "3" },
  ];
  const numQuestions = phrasePairs.length;

  const [progress, setProgress] = useState(0);
  const [l1Input, setl1Input] = useState("");

  function getPercentageCompleted() {
    const percent = 100 * (progress / numQuestions) 
    return percent;
  }

  function checkAnswer(answer) {
    const l2 = phrasePairs[progress]["l2"];
    if (answer === l2) {
      setl1Input("");
      setProgress((prev) => prev + 1);
    } else {
    }
  }

  return (
    <div class="lesson-container-1 Holiday-Cheer-5-hex">
      <div class="lesson-container-1a Holiday-Cheer-3-hex">
        <div class="lesson-container-1aa Holiday-Cheer-5-hex"></div>
        <div class="lesson-container-1ab Holiday-Cheer-5-hex">
          <div class="progress-bar total" >
            <div class="progress-bar completed" style={{ "width": `${getPercentageCompleted()}%` }}></div>
          </div>
        </div>
        <div class="lesson-container-1ac Holiday-Cheer-5-hex">
          <div class="heading-2">{name.toUpperCase()}</div>
        </div>
      </div>
      <div class="lesson-container-1b Holiday-Cheer-5-hex">
        <div class="lesson-container-1ba Holiday-Cheer-5-hex">
          <div class="lesson-l1">{phrasePairs[progress]["l1"]}</div>
          <input
            type="text"
            class="lesson-l2 Holiday-Cheer-5-hex"
            value={l1Input}
            onChange={(e) => setl1Input(e.target.value)}
          ></input>
        </div>
      </div>
      <div class="lesson-container-1c Holiday-Cheer-5-hex">
        <button class="lesson-skip lesson-button Holiday-Cheer-4-hex">
          <div>SKIP</div>
        </button>
        <button
          class="lesson-check lesson-button Holiday-Cheer-4-hex"
          onClick={() => checkAnswer(l1Input)}
        >
          <div>CHECK</div>
        </button>
      </div>
    </div>
  );
}

import "../styles/lesson.css";
import "../App.css";
import { TiTick } from "react-icons/ti";
import { IconContext } from "react-icons";
import React, { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

export default function Lesson({ name, setLesson }) {
  const phrasePairs = [
    { l1: "phrase 1a", l2: "phrase 1b", phraseid: "0" },
    { l1: "phrase 2a", l2: "phrase 2b", phraseid: "1" },
  ];
  const numQuestions = phrasePairs.length;

  const [progress, setProgress] = useState(0);
  const [l1Input, setl1Input] = useState("");

  function getPercentageCompleted() {
    const percent = 100 * (progress / numQuestions);
    return percent;
  }
  function viewProgressBar() {
    if (progress === 0) {
      return "none";
    } else {
      return "block";
    }
  }
  function safeProgressIncrement() {
    setProgress((prev) => Math.min(numQuestions, prev + 1));
  }

  function getNextPhrase() {
    if (progress < numQuestions) {
      return phrasePairs[progress]["l1"];
    } else {
      return "";
    }
  }

  function checkAnswer(answer) {
    if (progress < numQuestions) {
      const l2 = phrasePairs[progress]["l2"];
      if (answer === l2) {
        setl1Input("");
        safeProgressIncrement();
      } else {
        alert("incorrect: please try again");
      }
    }
  }

  const finishedElement = (
    <div class="lesson-container-1ba Holiday-Cheer-5-hex">
      <IconContext.Provider
        value={{
          size: 128,
          color: "gold",
          className: "global-class-name",
        }}
      >
        <TiTick />
      </IconContext.Provider>
      <div
        className="lesson-button home Holiday-Cheer-4-hex"
        onClick={() => setLesson("")}
      >
        HOME
      </div>
    </div>
  );

  return (
    <div class="lesson-container-1 Holiday-Cheer-5-hex">
      <div class="lesson-container-1a Holiday-Cheer-3-hex">
        <div class="lesson-container-1aa Holiday-Cheer-5-hex"></div>
        <div class="lesson-container-1ab Holiday-Cheer-5-hex">
          <div class="progress-bar total">
            <div
              class="progress-bar completed"
              style={{
                display: `${viewProgressBar()}`,
                width: `${getPercentageCompleted()}%`,
              }}
            ></div>
          </div>
          <div onClick={() => setLesson("")} className="close-button">
            <IconContext.Provider
              value={{
                size: 48,
                color: "black",
                className: "global-class-name",
              }}
            >
              <IoCloseSharp />
            </IconContext.Provider>
          </div>
        </div>
        <div class="lesson-container-1ac Holiday-Cheer-5-hex">
          <div class="heading-2">{name.toUpperCase()}</div>
        </div>
      </div>
      <div class="lesson-container-1b Holiday-Cheer-5-hex">
        {progress == numQuestions ? (
          finishedElement
        ) : (
          <div class="lesson-container-1ba Holiday-Cheer-5-hex">
            <div class="lesson-l1">{getNextPhrase()}</div>
            <input
              type="text"
              class="lesson-l2 Holiday-Cheer-5-hex"
              value={l1Input}
              onChange={(e) => setl1Input(e.target.value)}
            ></input>
          </div>
        )}
      </div>
      <div class="lesson-container-1c Holiday-Cheer-5-hex">
        <button
          class="lesson-skip lesson-button Holiday-Cheer-4-hex"
          onClick={() => safeProgressIncrement()}
        >
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

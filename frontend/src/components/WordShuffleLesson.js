import { getRandomSubarray, processPhrase, calculate_similarity, ShuffleWord, joinWords } from "../utils/phraseUtils";
import { useShuffledWords } from "./customhooks/useShuffleWords";
import { ENV_VARS } from "../env";
import { TiTick } from "react-icons/ti";
import { IconContext } from "react-icons";
import { AiOutlineLoading } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { FaEye } from "react-icons/fa";

import "../styles/lesson.css";
import "../styles/wordshufflelesson.css";
import "../App.css";

export default function WordShuffleLesson({ category, setLessonType, userDetails, language, fromL1, setViewLessonTypes }) {

  const [phrases, setPhrases] = useState([]);
  const numQuestions = phrases.length;
  const [progress, setProgress] = useState(0);

  const [similarity, setSimilarity] = useState("");
  //displayFeedback {0, 1, 2} 0: no feedback displayed, 1:display feedback, 2: display buffering
  const [displayFeedback, setDisplayFeedback] = useState(0);
  const [peekPhrase, setPeekPhrase] = useState(0);
  const [buttonSet, setButtonSet] = useState("check"); // or continue

  const { selected, unselected, select, unselect, setSelected, setUnselected } = useShuffledWords([], []);
  const [updateFeedback, setUpdateFeedback] = useState(0);
  const similarityThreshold = 0.9;
  const numPhrasesTested = 10;
  useEffect(() => {
    const fetchData = async () => {
      const url =
        `${ENV_VARS.REACT_APP_SERVER_IP}/api/phraseselection/category?` +
        new URLSearchParams({
          userid: userDetails["userid"],
          languageid: language["id"],
          category: category,
        }).toString();

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "authorization": userDetails["token"]
        },
      });
      if (response.status == 200) {
        const result = await response.json();
        const new_phrases = result.data.map(({ Phrase, PhraseSelection }) => {
          return {
            l1: Phrase.l1,
            l2: Phrase.l2,
            phraseid: Phrase.phraseid,
          };
        });
        const subset = getRandomSubarray(new_phrases, numPhrasesTested);
        setPhrases(subset);
      } else if (response.status === 401) {
        alert("Your session has expired. Please refresh to continue, if this doesnt work please log in again")

      } else {
        alert("problem calling backend api");
      }
    };
    fetchData();

  }, [userDetails["userid"]]);

  useEffect(() => {
    if (phrases && phrases.length > 0 & progress < numQuestions) {
      const splitPhrase = phrases[progress]["l2"].split(" ");
      const shuffled = getRandomSubarray(splitPhrase.map((v, i) => new ShuffleWord(v, i)
      ), splitPhrase.length);
      setUnselected(shuffled);
      setSelected([]);
    }

  }, [progress, phrases])


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
    setDisplayFeedback(0);
    setPeekPhrase(0);
  }

  function togglePeekPhrase() {
    setPeekPhrase((prev) => ~prev);
  }




  const getFeedbackColor = (similarity) => {
    if (similarity > similarityThreshold) {
      return "#79A637";
    } else if ((similarity < similarityThreshold) & (similarity > 0.4)) {
      return "#F2A922";
    }
  };
  const getFeedbackPhrase = (similarity) => {
    if (similarity > similarityThreshold) {
      return "Great job!";
    } else if ((similarity < 0.85) & (similarity > 0.4)) {
      return "You're close!";
    } else {
      return "not quite right, keep trying ...";
    }
  };

  const onContinue = async (e) => {
    setPeekPhrase(0);
    safeProgressIncrement();
    setButtonSet("check");

  };

  const onContinueKeyDown = async (e) => {
    if (e.key == "Enter") {
      await onContinue(e);
    }

  };


  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  async function example() {
    await sleep(4000);
    return 1;
  }
  const handleEnterKey = async (event) => {
    if (event.key = "Enter") {
      await checkAnswer();
    }

  }

  const checkAnswer = async () => {
    if (progress < numQuestions) {
      setUpdateFeedback((prev) => !prev);
      setDisplayFeedback(() => 2);
      var submittedAnswer = processPhrase(joinWords(selected));
      var expectedAnswer = processPhrase(phrases[progress]["l2"]);

      if (submittedAnswer === expectedAnswer) {
        setSimilarity(() => 1)
        setButtonSet("continue");
      } else {
        setSimilarity(() => 0.1)
      }
      setDisplayFeedback(1);
    }
  };

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
      <button
        autoFocus={progress == numQuestions ? 1 : 0}
        onKeyDown={(e) => { e.key == "Enter" && setLessonType("") }}
        type="submit"
        className="lesson-button home Holiday-Cheer-4-hex"
        onClick={() => setLessonType("")}
      >
        <div>Back to exercises</div>
      </button>
    </div>
  );

  const feedback = (
    <div className="lesson-similarity Holiday-Cheer-5-hex">
      {displayFeedback === 1 ? (
        <div
          style={{
            background: getFeedbackColor(similarity),
            width: "100%",
            height: "100%",
          }}
        >
          <div key={updateFeedback} className="feedback">
            <div>{getFeedbackPhrase(similarity)}</div>
          </div>
        </div>
      ) : displayFeedback === 0 ? null : displayFeedback === 2 ? (
        <AiOutlineLoading className="loading" />
      ) : null}
    </div>
  );

  const noPhrasesElement = (
    <div className="add-phrases-content">
      <div className="no-phrases">
        <div class="heading-2 category-name">{category.toUpperCase()}</div>
        <div onClick={() => { setLessonType(""); setViewLessonTypes(false) }} className="close-button-nophrases">
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
        <div className="add-phrases">Looks like there are no phrases yet,
          add some or browse phrases added by others.</div>
      </div>
    </div>
  );

  return numQuestions !== 0 ? (
    <div class="lesson-container-1 Holiday-Cheer-5-hex">
      <div id="lesson-form">
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
            <div onClick={() => setLessonType("")} className="close-button">
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
            <div class="heading-2">{category.toUpperCase()}</div>
          </div>
        </div>

        <div class="lesson-container-1b Holiday-Cheer-5-hex">
          {progress == numQuestions ? (
            finishedElement
          ) : (
            <div class="lesson-container-1ba Holiday-Cheer-5-hex">
              <div className="shuffle-lesson-l1"><div className="shuffle-l1">{phrases[progress]["l1"]}</div>
                <div className="shuffle-word-selected">{selected.map((word) => <div key={word.getId()} onClick={() => unselect(word.getId())} className="shuffle-word"> {word.getWord()} </div>)}</div>
                <div className="shuffle-peeked-phrase">
                  {peekPhrase ? phrases[progress]["l2"] : null}
                </div>
                <div className="peek-icon" onClick={togglePeekPhrase}>
                  <FaEye />
                </div>

              </div>

              <div tabIndex={buttonSet == "check" ? 0 : -1} onKeyDown={handleEnterKey} className="shuffle-word-unselected-container">
                <div className="shuffle-word-unselected Holiday-Cheer-5-hex">
                  {unselected.map((word) => <div key={word.getId()} onClick={() => select(word.getId())} className="shuffle-word"> {word.getWord()} </div>)}
                </div>
              </div>


            </div>
          )}
        </div>
        <div class="lesson-container-1c Holiday-Cheer-5-hex">

          {buttonSet === "check" && progress != numQuestions ? (
            <button
              type="button"
              class="lesson-skip lesson-button Holiday-Cheer-4-hex default-button"
              onClick={() => safeProgressIncrement()}
            >
              <div>SKIP</div>
            </button>
          ) : (
            <div class="lesson-button-placeholder"></div>
          )}

          {feedback}
          {buttonSet === "check" && progress != numQuestions ? (
            <button
              type="submit"
              class="lesson-check lesson-button Holiday-Cheer-4-hex default-button"
              onClick={() => checkAnswer()}
            >
              <div>CHECK</div>

            </button>
          ) : (
            buttonSet == "continue" && progress != numQuestions ? <input
              reaOnly
              class="lesson-check lesson-button Holiday-Cheer-4-hex"
              value="CONTINUE"
              autoFocus={buttonSet == "continue" ? 1 : 0} onKeyDown={onContinueKeyDown}
              onClick={() => onContinue()}
            >
            </input> : null
          )}
        </div>
      </div>
    </div>
  ) : (
    noPhrasesElement
  );
}

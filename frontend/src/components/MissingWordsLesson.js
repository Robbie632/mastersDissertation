import { getRandomSubarray, processPhrase, calculate_similarity } from "../utils/phraseUtils";
import { ENV_VARS } from "../env";
import { TiTick } from "react-icons/ti";
import { IconContext } from "react-icons";
import { AiOutlineLoading } from "react-icons/ai";
import React, { useEffect, useState, useRef } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { FaEye } from "react-icons/fa";

import "../styles/lesson.css";
import "../styles/missingwordslesson.css";
import "../App.css";

export default function MissingWordsLesson({ category, setLessonType, userDetails, language, setViewLessonTypes }) {

  const [phrases, setPhrases] = useState([]);
  const numQuestions = phrases.length;
  const [progress, setProgress] = useState(0);
  const [phraseAInput, setPhraseAInput] = useState("");
  const [similarity, setSimilarity] = useState("");
  //displayFeedback {0, 1, 2} 0: no feedback displayed, 1:display feedback, 2: display buffering
  const [displayFeedback, setDisplayFeedback] = useState(0);
  const [peekPhrase, setPeekPhrase] = useState(0);
  const [buttonSet, setButtonSet] = useState("check"); // or continue
  const [missingWordData, SetMissingWordData] = useState(null);

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

    if (phrases.length !== 0 & progress < numQuestions) {
      var extractedWordData = extractWord(phrases[progress]["l2"]);
      SetMissingWordData(extractedWordData);
    }
    // TO DO problem, I think the progress is updated after the first input is made

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

  function extractWord(sentence) {

    var splitSentence = sentence.split(" ");
    var index = Math.floor(splitSentence.length * Math.random());
    var word = splitSentence[index];
    splitSentence[index] = "__";
    splitSentence = splitSentence.join(" ");

    return ({
      splitSentence,
      word,
      index
    })
  }

  function togglePeekPhrase() {
    setPeekPhrase((prev) => ~prev);
  }

  function getNextPhrase() {
    if (progress < numQuestions) {
      var phraseWithMissingWord = null;
      if (missingWordData) {
        phraseWithMissingWord = missingWordData.splitSentence;
      }

      return <div className="l1">{phraseWithMissingWord}</div>;
    } else {
      return "";
    }
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

  const onContinue = () => {
    setPhraseAInput("");
    setPeekPhrase(0);
    safeProgressIncrement();
    setButtonSet("check");
  };


  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  async function example() {
    await sleep(4000);
    return 1;
  }
  const onFormSubmit = async (event, answer) => {
    event.preventDefault();
  }

  const checkAnswer = async (answer) => {
    if (progress < numQuestions) {
      var phraseB;
      setDisplayFeedback(() => 2);

      const phraseid = phrases[progress]["phraseid"];
      const phraseBCleaned = processPhrase(missingWordData.word);
      const answerCleaned = processPhrase(answer);

      var similarity = await calculate_similarity(answerCleaned, phraseBCleaned, userDetails);
      if (similarity == null) {
        alert("problem checking phrase, please contact website admin")
      }
      else {
        setSimilarity(() => similarity.toFixed(2));
        if (similarity > similarityThreshold) {
          setButtonSet("continue");
        }
        const response = await fetch(
          `${ENV_VARS.REACT_APP_SERVER_IP}/api/performance`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "authorization": userDetails["token"]
            },
            body: JSON.stringify({
              userid: userDetails["userid"],
              phraseid: phraseid,
              metric: similarity,
            }),
          }
        );
        if (response.status !== 201) {
          alert("problem writing result to database");
        }
        setDisplayFeedback(1);
      }

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
        type="submit"
        autoFocus={progress == numQuestions ? 1 : 0}
        onKeyDown={(e) => { e.key == "Enter" && setLessonType("") }}
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
          <div className="feedback">
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
      <form id="lesson-form" onSubmit={(event) => onFormSubmit(event, phraseAInput)}>
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
              <div class="lesson-l1">{getNextPhrase()}
                <div className="peeked-phrase">
                  {peekPhrase ? missingWordData.word : null}
                </div>
                <div className="peek-icon" onClick={togglePeekPhrase}>
                  <FaEye />
                </div>
                <div className="phrase-b">{phrases[progress]["l1"]}</div>

              </div>
              <input
                type="text"
                class="lesson-l2 Holiday-Cheer-5-hex"
                value={phraseAInput}
                onChange={(e) => setPhraseAInput(e.target.value)}
              ></input>

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
              onClick={() => checkAnswer(phraseAInput)}
            >
              <div>CHECK</div>

            </button>
          ) : (
            buttonSet == "continue" && progress != numQuestions ? <button
              type="submit"
              class="lesson-check lesson-button Holiday-Cheer-4-hex"
              onClick={() => onContinue()}
            >
              <div>CONTINUE</div>
            </button> : null


          )}
        </div>
      </form>
    </div>
  ) : (
    noPhrasesElement
  );
}

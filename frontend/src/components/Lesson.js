import StarRating from "./StarRating";
import { ENV_VARS } from "../env";
import { TiTick } from "react-icons/ti";
import { IconContext } from "react-icons";
import { AiOutlineLoading } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

import "../styles/lesson.css";
import "../App.css";

export default function Lesson({ category, setLesson, userDetails, language }) {
  const [phrases, setPhrases] = useState([]);
  const numQuestions = phrases.length;
  const [progress, setProgress] = useState(0);
  const [l1Input, setl1Input] = useState("");
  const [similarity, setSimilarity] = useState("");
  //displayFeedback {0, 1, 2} 0: no feedback displayed, 1:display feedback, 2: display buffering
  const [displayFeedback, setDisplayFeedback] = useState(0);
  const [buttonSet, setButtonSet] = useState("check"); // or continue

  const similarityThreshold = 0.9;
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
        setPhrases(new_phrases);
      } else {
        alert("problem calling backend api");
      }
    };
    fetchData();
  }, [userDetails["userid"]]);

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
  }

  function getNextPhrase() {
    if (progress < numQuestions) {
      return phrases[progress]["l1"];
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

  const calculate_similarity = async (a, b) => {
    const response = await fetch(`${ENV_VARS.REACT_APP_SERVER_IP}/api/metric`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": userDetails["token"]
      },
      body: JSON.stringify({
        phrasea: a,
        phraseb: b,
      }),
    });
    if (response.status !== 200) {
      alert("problem getting similarity metric");
    } else {
      const metric = await response.json();
      const metric_list = metric["metric"];
      return metric_list[0];
    }
  };

  const onContinue = () => {
    setl1Input("");
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

  const checkAnswer = async (answer) => {
    if (progress < numQuestions) {
      setDisplayFeedback(() => 2);
      const l2 = phrases[progress]["l2"];
      const phraseid = phrases[progress]["phraseid"];
      var similarity = await calculate_similarity(answer, l2);
      if (!similarity) {
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
      <div
        className="lesson-button home Holiday-Cheer-4-hex"
        onClick={() => setLesson("")}
      >
        HOME
      </div>
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
      <div class="heading-2 category-name">{category.toUpperCase()}</div>
      <div className="add-phrases">No phrases yet, head to LEARN or BROWSE to add some ...</div>
    </div>
  );

  return numQuestions !== 0 ? (
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
          <div class="heading-2">{category.toUpperCase()}</div>
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
        {buttonSet === "check" ? (
          <button
            class="lesson-skip lesson-button Holiday-Cheer-4-hex default-button"
            onClick={() => safeProgressIncrement()}
          >
            <div>SKIP</div>
          </button>
        ) : (
          <div class="lesson-button-placeholder"></div>
        )}

        {feedback}
        {buttonSet === "check" ? (
          <button
            class="lesson-check lesson-button Holiday-Cheer-4-hex default-button"
            onClick={() => checkAnswer(l1Input)}
          >
            <div>CHECK</div>
          </button>
        ) : (
          <button
            class="lesson-check lesson-button Holiday-Cheer-4-hex"
            onClick={() => onContinue()}
          >
            <div>CONTINUE</div>
          </button>
        )}
      </div>
    </div>
  ) : (
    noPhrasesElement
  );
}

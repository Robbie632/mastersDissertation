import "../styles/lesson.css";
import "../App.css";
import StarRating from "./StarRating";
import { TiTick } from "react-icons/ti";
import { IconContext } from "react-icons";
import React, { useEffect,useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

export default function Lesson({ category, setLesson, userDetails, language }) {

  const [phrases, setPhrases] = useState([]);
  const numQuestions = phrases.length;
  const [progress, setProgress] = useState(0);
  const [l1Input, setl1Input] = useState("");
  const [similarity, setSimilarity] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const url =
        "http://localhost:5000/api/phraseselection/category?" +
        new URLSearchParams({
          userid: userDetails["userid"],
          languageid: language["id"],
          category: category,
        }).toString();

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status == 200) {
        const result = await response.json();
        const new_phrases = result.data.map(({ Phrase, PhraseSelection }) => {
          return ({
            l1: Phrase.l1,
            l2: Phrase.l2,
            phraseid: Phrase.phraseid
          })
        }) 
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
  }

  function getNextPhrase() {
    if (progress < numQuestions) {
      return phrases[progress]["l1"];
    } else {
      return "";
    }
  }

  const calculate_similarity = async (a, b) => {

    const response = await fetch("http://localhost:5000/api/metric", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phrasea: a,
        phraseb: b
      }),
    });
    if (response.status !== 200) {
      alert("problem getting similarity metric")
    } else {
      const metric = await response.json();
      const metric_list = metric["metric"];
      return metric_list[0]
    }
    
  }

  const checkAnswer = async (answer) => {
    if (progress < numQuestions) {
      const l2 = phrases[progress]["l2"];
      const phraseid = phrases[progress]["phraseid"];
      const similarity = await calculate_similarity(answer, l2);
      setSimilarity(() => similarity.toFixed(2))
      if (similarity >0.85) {
        setl1Input("");
        safeProgressIncrement();
      } else {
        alert("incorrect: please try again");
      }

      const response = await fetch("http://localhost:5000/api/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userid: userDetails["userid"],
          phraseid: phraseid,
          metric: similarity
        }),
      });
      if (response.status !== 201) {
        alert("problem writing result to database")
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
        <button
          class="lesson-skip lesson-button Holiday-Cheer-4-hex"
          onClick={() => safeProgressIncrement()}
        >
          <div>SKIP</div>
        </button>
        <div className="lesson-similarity Holiday-Cheer-5-hex"> 
          <div>
            { similarity*100 } %
          </div>
        </div>
        <button
          class="lesson-check lesson-button Holiday-Cheer-4-hex"
          onClick={() => checkAnswer(l1Input)}
        >
          <div>CHECK</div>
        </button>
      </div>
      <div>
        <StarRating phraseid={(phrases && phrases.length != 0 && progress < phrases.length) ? phrases[progress]["phraseid"] : -1} userid={userDetails["userid"]}></StarRating>
        </div>
    </div>
  );
}

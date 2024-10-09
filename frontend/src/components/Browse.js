import "../styles/browse.css";
import "../App.css";
import PhrasePair from "./PhrasePair";
import StarRating from "./StarRating";
import { ENV_VARS } from "../env";

import { useState, useEffect } from "react";
import { IconContext } from "react-icons";
import { FaStar } from "react-icons/fa";
import { CiStar } from "react-icons/ci";

export default function Browse({userDetails}) {
  const [phrases, setPhrases] = useState([]);
  const [category, setCategory] = useState("introductions");
  const [updatePhrasesIndicator, setUpdatePhrasesIndicator] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const url =
        `${ENV_VARS.REACT_APP_SERVER_IP}/api/phrases/category/user?` +
        new URLSearchParams({
          category: category,
          userid: userDetails.userid
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
        const new_phrases = result.data.map((Phrase) => {
          return {
            l1: Phrase.l1,
            l2: Phrase.l2,
            phraseid: Phrase.phraseid,
            stars: Phrase.average_rating
          };
        });
        setPhrases(() => new_phrases);
      } else {
        alert("problem calling backend api");
      }
    };
    fetchData();
  }, [category, updatePhrasesIndicator]);

    const handleChange = (event) => {
      setCategory(event.target.value);
    };
  return (
    <div>
      <div className="dropdown">
        <label for="categories" className="heading-1">
          Category:
        </label>
        <select onChange={handleChange} className="heading-2" name="categories" id="categories">
          <option className="heading-3" value="cafe">
            Cafe
          </option>
          <option className="heading-3" value="restaurant">
            Restaurant
          </option>
          <option className="heading-3" value="family">
            Family
          </option>
          <option className="heading-3" value="introductions" selected="selected">
            Introductions
          </option>
          <option className="heading-3" value="hobbies">
            Hobbies
          </option>
        </select>
      </div>
      <div>
        Select "Get Phrase" to add the phrase to your lesson
    </div>
      <div className="browse-container-1">
        <div id="browse-container-2">
          {phrases.map(({ l1, l2, phraseid, stars }) => (
            <div id="phrase-pair-container">
              <PhrasePair key={phraseid} l1={l1} l2={l2} allowEdit={false} phraseid={phraseid} allowAddToPhraseSelection={true} userDetails={userDetails} setUpdatePhrasesIndicator={setUpdatePhrasesIndicator}></PhrasePair>
              <div className="rate-phrase-widget">
              <a>Rate Phrase</a>
              <StarRating  {... { phraseid, userDetails }}></StarRating>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

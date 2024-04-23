import "../styles/browse.css";
import "../App.css";
import PhrasePair from "./PhrasePair";
import { useState } from "react";
import { IconContext } from "react-icons";
import { FaStar } from "react-icons/fa";
import { CiStar } from "react-icons/ci";

export default function Browse() {
  const phrasePairs = [
    { l1: "phrase 1a", l2: "phrase 1b", phraseid: "0", stars: 3 },
    { l1: "phrase 2a", l2: "phrase 2b", phraseid: "1", stars: 3 },
    { l1: "phrase 3a", l2: "phrase 3b", phraseid: "2", stars: 3 },
    { l1: "phrase 4a", l2: "phrase 4b", phraseid: "3", stars: 3 },
  ];

  const [phrases, setPhrases] = useState(phrasePairs);

  return (
    <div className="browse-container-1">
      <div id="browse-container-2">
        {phrases.map(({ l1, l2, phraseid, stars }) => (
          <div id="phrase-pair-container">
            <PhrasePair l1={l1} l2={l2} allowEdit={false}></PhrasePair>

            <IconContext.Provider
              value={{
                size: 32,
                color: "#024554",
                className: "global-class-name",
              }}
            >
              {Array.from({ length: stars }, (value, index) => (
                <FaStar style={{ size: "48" }} />
              ))}
              {Array.from({ length: 5 - stars }, (value, index) => (
                <CiStar />
              ))}
            </IconContext.Provider>
          </div>
        ))}
      </div>
    </div>
  );
}

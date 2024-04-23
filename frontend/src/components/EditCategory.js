import "../styles/editcategory.css";
import PhrasePair from "./PhrasePair";
import { FaRegTrashAlt } from "react-icons/fa";
import { useState } from "react";
import { IconContext } from "react-icons";

export default function EditCategory({ name }) {
  const phrasePairs = [
    { l1: "phrase 1a", l2: "phrase 1b", phraseid: "0" },
    { l1: "phrase 2a", l2: "phrase 2b", phraseid: "1" },
    { l1: "phrase 3a", l2: "phrase 3b", phraseid: "2" },
    { l1: "phrase 4a", l2: "phrase 4b", phraseid: "3" },
  ];

  const [phrases, setPhrases] = useState(phrasePairs);

  return (
    <div className="edit-category-container-1">
      <IconContext.Provider
        value={{
          size: 32,
          color: "#024554",
          className: "global-class-name",
        }}
      >
        <div id="edit-category-container-2">
          {phrases.map(({ l1, l2, phraseid }) => (
            <div id="phrase-pair-container">
              <PhrasePair l1={l1} l2={l2}></PhrasePair>
              <div className="trash">
                <FaRegTrashAlt id={phraseid} />
              </div>
            </div>
          ))}
        </div>
      </IconContext.Provider>
    </div>
  );
}

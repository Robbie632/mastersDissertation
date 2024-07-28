import "../App.css";
import "../styles/editcategory.css";
import PhrasePair from "./PhrasePair";
import { ENV_VARS } from "../env";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { IoCloseSharp } from "react-icons/io5";

export default function EditCategory({
  category,
  userDetails,
  language,
  setEdit,
}) {
  const [l1input, setL1input] = useState("");
  const [l2input, setL2input] = useState("");
  const [phrases, setPhrases] = useState([]);
  const [addPhraseWidgetDisplayed, setAddPhraseWidgetDisplayed] =
    useState(false);
  const [phrasesChangedIndicator, SetPhrasesChangedIndicator] = useState(0);

  function onChangeInputL1(event) {
    setL1input(event.target.value);
  }
  function onChangeInputL2(event) {
    setL2input(event.target.value);
  }
  const onAddPhrasePair = async (e) => {
    e.preventDefault();
    const response = await fetch(`${ENV_VARS.REACT_APP_SERVER_IP}/api/phrase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": userDetails["token"]
       },
      body: JSON.stringify({
        l1: l1input,
        l2: l2input,
        languageid: 0,
        userid: userDetails["userid"],
        category: category,
      }),
    });

    if (response.status === 201) {
      const data = await response.json();
      const phraseid = data["id"];
      const response2 = await fetch(
        `${ENV_VARS.REACT_APP_SERVER_IP}/api/phraseselection`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "authorization": userDetails["token"]
           },
          body: JSON.stringify({
            phraseid: phraseid,
            userid: userDetails["userid"],
          }),
        }
      );

      if (response2.status === 201) {
        const data2 = await response2.json();
        const phraseselectionid = response2["id"];
      }
    }

    togglePhrasesChangedIndicator();
    setAddPhraseWidgetDisplayed(() => false);
    setL1input("");
    setL2input("");
  };

  const displayAddPhraseWidget = async () => {
    setAddPhraseWidgetDisplayed((prev) => ~prev);
  };

  function togglePhrasesChangedIndicator() {
    SetPhrasesChangedIndicator((prev) => !prev);
  }

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
            phraseselectionid: PhraseSelection.phraseselectionid,
          };
        });
        setPhrases(() => new_phrases);
      } else {
        alert("problem calling backend api");
      }
    };
    fetchData();
  }, [userDetails["userid"], phrasesChangedIndicator]);

  const addPhraseWidget = (
    <form onSubmit={onAddPhrasePair} className="add-phrase-widget-container">
      <input
        type="text"
        value={l1input}
        onChange={onChangeInputL1}
        placeholder="english phrase..."
        className="add-phrase-widget heading-3 Holiday-Cheer-5-hex"
      ></input>
      <input
        type="text"
        value={l2input}
        onChange={onChangeInputL2}
        className="add-phrase-widget heading-3 Holiday-Cheer-5-hex"
        placeholder="swedish phrase..."
      ></input>
      <button
        type="submit"
        className="add-phrase-widget-submit heading-3 Holiday-Cheer-2-hex"
      >
        ADD PHRASE
      </button>
    </form>
  );

  return (
    <div className="edit-category-container-1">
      <div id="edit-category-container-2">
        <div className={"category-status"}>
          {category.toUpperCase()}
          <div className="close" onClick={() => setEdit("")}>
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
        <IconContext.Provider
          value={{
            size: 72,
            color: "#024554",
            className: "global-class-name",
          }}
        >
          <div
            className="add-category"
            onClick={() => displayAddPhraseWidget()}
          >
            {addPhraseWidgetDisplayed ? (
              <CiCircleMinus />
            ) : (
              <div className="add-phrase-symbol-container">
                {" "}
                <CiCirclePlus /> Add Phrase
              </div>
            )}
          </div>
          {addPhraseWidgetDisplayed ? addPhraseWidget : null}
        </IconContext.Provider>
        {phrases.map(({ l1, l2, phraseid, phraseselectionid }) => (
          <div key={phraseselectionid}>
            <IconContext.Provider
              value={{
                size: 32,
                color: "#024554",
                className: "global-class-name",
              }}
            >
              <div id="phrase-pair-container">
                <PhrasePair
                  l1={l1}
                  l2={l2}
                  userDetails={userDetails}
                  phraseid={phraseid}
                  phraseselectionid={phraseselectionid}
                  togglePhrasesChangedIndicator={togglePhrasesChangedIndicator}
                ></PhrasePair>
              </div>
            </IconContext.Provider>
          </div>
        ))}
      </div>
    </div>
  );
}

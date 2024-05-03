import "../styles/phrasepair.css";
import { MdEdit } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { useState } from "react";

export default function PhrasePair({
  l1,
  l2,
  allowEdit = true,
  allowAddToPhraseSelection = false,
  phraseid,
  phraseselectionid,
  togglePhrasesChangedIndicator,
  userDetails,
  setUpdatePhrasesIndicator
}) {
  const [mode, setMode] = useState("view");

  const [formData, setFormData] = useState({
    l1: l1,
    l2: l2,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleGetPhrase = async () => {

    const response = await fetch(
      "http://localhost:5000/api/phraseselection",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phraseid: phraseid,
          userid: userDetails["userid"],
        }),
      }
    );
    if (response.status !== 201) {
      alert("problem getting phrase")
    }
    if (response.status === 201) {
      setUpdatePhrasesIndicator((prev) => ~prev);
      const data = await response.json();
      const phraseselectionid = response["id"];
    }
  }
  
  const handleSave = async (e) => {
    const response = await fetch("http://localhost:5000/api/phrase", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        l1: formData["l1"],
        l2: formData["l2"],
        phraseid: phraseid,
      }),
    });
    if (response.status === 200) {
      const data = await response.json();
      setMode("view");
      alert("updated phrase");
    } else {
      alert("problem updating phrase");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/phraseselection", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phraseselectionid: phraseselectionid,
      }),
    });

    if (response.status == 200) {
      alert("successful delete");
      togglePhrasesChangedIndicator();
    } else {
      alert("problem trying to delete");
    }

    setMode((v) => "view");
  };

  const l1ElementEdit = (
    <input
      className="l-edit"
      type="text"
      name="l1"
      value={formData.l1}
      onChange={handleChange}
    ></input>
  );
  const l2ElementEdit = (
    <input
      className="l-edit"
      type="text"
      name="l2"
      value={formData.l2}
      onChange={handleChange}
    ></input>
  );
  const l1ElementView = (
    <div id="l1" className="l-view Holiday-Cheer-3-hex heading-2">
      <div>{formData.l1}</div>
    </div>
  );
  const l2ElementView = (
    <div id="l2" className="l-view Holiday-Cheer-3-hex heading-2">
      {formData.l2}
    </div>
  );
  const addToPhraseSelectionElement = (
    <div className="Holiday-Cheer-2-hex get-phrase-button" onClick={handleGetPhrase}>
      <div>GET PHRASE</div>
    </div>
  );
  function renderAddToPhraseSelectionElement() {
    if ((mode === "view") & allowAddToPhraseSelection) {
      return addToPhraseSelectionElement;
    }
  }

  return (
    <div className="phrase-pair-container-1">
      {mode === "view" && l1ElementView}
      {mode === "view" && l2ElementView}
      {renderAddToPhraseSelectionElement()}
      {mode === "view" && allowEdit && (
        <div id="edit-phrase-pair">
          <MdEdit onClick={() => setMode("edit")} />
        </div>
      )}
      {mode == "edit" && (
        <form onSubmit={handleSubmit} className="phrase-pair-container-1">
          {l1ElementEdit}
          {l2ElementEdit}
          <div id="edit-phrase-pair">
            <MdEdit onClick={() => setMode("view")} />
          </div>
          <div id="save-phrase-pair" onClick={handleSave}>
            <FaRegSave />
          </div>
          <button
            className="Holiday-Cheer-5-hex"
            type="submit"
            id="delete-phrase-pair"
          >
            <FaRegTrashAlt />
          </button>
        </form>
      )}
    </div>
  );
}

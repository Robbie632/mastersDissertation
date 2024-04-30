import "../styles/phrasepair.css";
import { MdEdit } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { useState } from "react";

export default function PhrasePair({
  l1,
  l2,
  allowEdit = true,
  phraseselectionid,
  togglePhrasesChangedIndicator,
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
  const handleSave = async (e) => {
    alert("insert save logic here, just do fetch call to /api/phrases and return to view mode for phrase pair")
  }

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
    <textarea
      name="l1"
      rows="4"
      cols="20"
      value={formData.l1}
      onChange={handleChange}
    ></textarea>
  );
  const l2ElementEdit = (
    <textarea
      name="l2"
      rows="1"
      cols="10"
      value={formData.l2}
      onChange={handleChange}
    ></textarea>
  );
  const l1ElementView = (
    <div id="l1" className="l-view Holiday-Cheer-3-hex heading-2">
      {formData.l1}
    </div>
  );
  const l2ElementView = (
    <div id="l2" className="l-view Holiday-Cheer-3-hex heading-2">
      {formData.l2}
    </div>
  );

  return (
    <div className="phrase-pair-container-1">
      {mode === "view" && l1ElementView}
      {mode === "view" && l2ElementView}
      {mode === "view" && allowEdit && (
        <div id="edit-phrase-pair">
          <MdEdit onClick={() => setMode("edit")} />
        </div>
      )}
      {mode == "edit" && (
        <div>
          <form onSubmit={handleSubmit} className="phrase-pair-container-1">
            {l1ElementEdit}
            {l2ElementEdit}
            <div id="save-phrase-pair" onClick={handleSave}>
              <FaRegSave />
            </div>
            <button className="Holiday-Cheer-5-hex" type="submit" id="delete-phrase-pair">
              <FaRegTrashAlt />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

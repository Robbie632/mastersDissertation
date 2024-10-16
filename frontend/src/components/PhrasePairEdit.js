import "../styles/phrasepairedit.css";
import { ENV_VARS } from "../env";
import StaticStars from "./StaticStars";
import { MdEdit } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { useState } from "react";

export default function PhrasePairEdit({
  l1,
  l2,
  allowEdit = true,
  allowAddToPhraseSelection = false,
  phraseid,
  phraseselectionid,
  togglePhrasesChangedIndicator,
  userDetails,
  setUpdatePhrasesIndicator,
  stars,
  AllowOnlyDelete
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
    e.preventDefault()
    const response = await fetch(`${ENV_VARS.REACT_APP_SERVER_IP}/api/phrase`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "authorization": userDetails["token"]
      },
      body: JSON.stringify({
        l1: formData["l1"],
        l2: formData["l2"],
        phraseid: phraseid,
      }),
    });
    if (response.status === 200) {
      const data = await response.json();
      setMode("view");
    } else {
      alert("problem updating phrase");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const response = await fetch(`${ENV_VARS.REACT_APP_SERVER_IP}/api/phraseselection`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "authorization": userDetails["token"]
      },
      body: JSON.stringify({
        phraseselectionid: phraseselectionid,
      }),
    });

    if (response.status == 200) {
      togglePhrasesChangedIndicator();
    } else {
      alert("problem trying to delete");
    }

    setMode((v) => "view");
  };

  const l1ElementEdit = (
    <input
      className="l-view-edit input-mode Holiday-Cheer-5-hex heading-2 indent"
      type="text"
      name="l1"
      value={formData.l1}
      onChange={handleChange}
      autoFocus
      required
    ></input>
  );
  const l2ElementEdit = (
    <input
      className="l-view-edit input-mode Holiday-Cheer-5-hex heading-2 indent"
      type="text"
      name="l2"
      value={formData.l2}
      onChange={handleChange}
      required
    ></input>
  );
  const l1ElementView = (
    <div id="l1" className="l-view-edit Holiday-Cheer-3-hex heading-2">
      <div>{formData.l1}</div>
    </div>
  );
  const l2ElementView = (
    <div id="l2" className="l-view-edit Holiday-Cheer-3-hex heading-2">
      {formData.l2}
    </div>
  );
  const addToPhraseSelectionElement = (
    <div>
      <div className="Holiday-Cheer-2-hex get-phrase-button" onClick={handleGetPhrase}>
        <div>GET PHRASE</div>
      </div>
      <StaticStars starCount={stars} ></StaticStars>
    </div>

  );
  function renderAddToPhraseSelectionElement() {
    if ((mode === "view") & allowAddToPhraseSelection) {
      return addToPhraseSelectionElement;
    }
  }

  return (
    <div className="phrase-pair-container-1-edit">

      {mode === "view" | AllowOnlyDelete && <div className="l1-block"> {l1ElementView} </div>}


      {mode === "view" | AllowOnlyDelete && <div className="l2-block"> {l2ElementView} </div>}

      {renderAddToPhraseSelectionElement()}
      {mode === "view" && allowEdit && (
        <div className="edit-widgets">
          <div className="edit-phrase-pair">
            <MdEdit onClick={() => setMode("edit")} />
          </div>

        </div>
      )}
      {mode == "edit" && (
        <form onSubmit={AllowOnlyDelete ? (e) => e.preventDefault() : handleSave} className="width-100">
          {!AllowOnlyDelete ? <div className="l1-block">
            <h5>English phrase</h5>
            {l1ElementEdit}
          </div> : null}
          {!AllowOnlyDelete ? <div className="l2-block">
            <h5>Swedish phrase</h5>
            {l2ElementEdit}
          </div> : null}


          <div className="edit-widgets">
            {!AllowOnlyDelete ? <button type="submit" className="Holiday-Cheer-5-hex" id="save-phrase-pair" onClick={handleSave}>
              <FaRegSave />
            </button> : null}

            <div className="edit-phrase-pair">
              <MdEdit onClick={() => setMode("view")} />
            </div>

            <div
              className="Holiday-Cheer-5-hex"
              onClick={handleDelete}
              id="delete-phrase-pair"
            >
              <FaRegTrashAlt />
            </div>
          </div>

        </form>
      )}
    </div>
  );
}

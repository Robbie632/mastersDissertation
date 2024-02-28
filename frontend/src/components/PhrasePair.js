import "../styles/phrasepair.css";
import { MdEdit } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";
import { useState } from "react";

export default function PhrasePair({ l1, l2 }) {
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
  const handleSubmit = (e) => {
    e.preventDefault();
    // You can perform any validation or submit the form data as needed
    setMode((v) => "view");
  };

  const l1ElementEdit = (
    <input
      type="test"
      id="l1"
      name="l1"
      value={formData.l1}
      onChange={handleChange}
    ></input>
  );
  const l2ElementEdit = (
    <input
      type="text"
      id="l2"
      name="l2"
      value={formData.l2}
      onChange={handleChange}
    ></input>
  );
  const l1ElementView = <div id="l1">{formData.l1}</div>;
  const l2ElementView = <div id="l2">{formData.l2}</div>;

  return (
    <div className="phrase-pair-container-1">
      {mode === "view" && l1ElementView}
      {mode === "view" && l2ElementView}
      {mode === "view" && (
        <div id="edit-phrase-pair">
          <MdEdit onClick={() => setMode("edit")} />
        </div>
      )}
      {mode == "edit" && (
        <form onSubmit={handleSubmit} className="phrase-pair-container-1">
          {l1ElementEdit}
          {l2ElementEdit}
          <button type="submit" id="save-phrase-pair">
            <FaRegSave />
          </button>
        </form>
      )}
    </div>
  );
}

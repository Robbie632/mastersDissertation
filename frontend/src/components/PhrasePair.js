import "../styles/phrasepair.css";
import { MdEdit } from "react-icons/md";

export default function PhrasePair({ l1, l2 }) {
  return (
    <div id="phrase-pair-container-1">
      <div id="l1">{ l1}</div>
      <div id="l2">{l2}</div>
      <div id="edit-phrase-pair"><MdEdit /></div>
      <div id="save-phrase-pair">save placeholder</div>
    </div>
  )
  
}
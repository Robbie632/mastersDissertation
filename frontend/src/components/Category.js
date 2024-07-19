import "../styles/category.css";
import "../App.css";
import { MdEdit } from "react-icons/md";

export default function Category({ name, setLesson, setEdit }) {
  return (
    <div className="category Holiday-Cheer-2-hex heading-3">
      <div id="category-container-1" >
        <div id="category-name" onClick={() => setLesson(name)}>{name}</div>
        <div id="category-icons">
          <div className="edit-icon" onClick={() => {
            setEdit(name);
          }}>
            <MdEdit/> edit phrases
          </div>
        </div>
      </div>
    </div>
  );
}

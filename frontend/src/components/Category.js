import "../styles/category.css";
import "../App.css";
import { MdEdit } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";

export default function Category({ name, setLesson, setEdit }) {
  return (
    <div className="category Holiday-Cheer-2-hex heading-3">
      <div id="category-container-1" onClick={() => setLesson(name)}>
        <div id="category-name">{name}</div>
        <div id="category-icons">
          <div className="edit-icon">
            <MdEdit  onClick={() => setEdit(name)} />
          </div>
          <div className="delete-icon">
            <FaRegTrashAlt/>
          </div>
          
        </div>
      </div>
    </div>
  );
}

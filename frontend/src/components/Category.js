import "../styles/category.css";
import { MdEdit } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";

export default function Category({ name, setLesson, setEdit }) {
  return (
    <div className="category">
      <div id="category-container-1">
        <div id="category-name">{name}</div>
        <div id="category-icons">
          <MdEdit onClick={() => setEdit(name)} />
          <FaRegTrashAlt />
        </div>
      </div>
    </div>
  );
}

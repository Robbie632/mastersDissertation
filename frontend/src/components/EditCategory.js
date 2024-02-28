import "../styles/editcategory.css";
import PhrasePair from "./PhrasePair";

export default function EditCategory({ name }) {
  const phrases = [
    { l1: "phrase 1a", l2: "phrase 1b" },
    { l1: "phrase 2a", l2: "phrase 2b" },
    { l1: "phrase 3a", l2: "phrase 3b" },
    { l1: "phrase 4a", l2: "phrase 4b" },
    
  ];
  return (
    <div className="edit-category-container-1">
              <div>{name}
        </div>
      <div id="edit-category-container-2">
        {phrases.map(({ l1, l2 }) => <PhrasePair l1={l1} l2={l2}></PhrasePair>) }
      </div>
    </div>
  );
}

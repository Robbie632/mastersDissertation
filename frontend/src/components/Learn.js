import "../styles/learn.css";
import "../App.css";
import Category from "./Category";
import ChooseLessonType from "./ChooseLessonType";
import EditCategory from "./EditCategory";
import { useState } from "react";

export default function Learn({ userDetails, language }) {
  const [lesson, setLesson] = useState("");
  const [edit, setEdit] = useState("");
  const [viewLessonTypes, setViewLessonTypes] = useState(false);

  const categories = [
    "cafe",
    "restaurant",
    "family",
    "introductions",
    "hobbies",
  ];


  const categoryElements = (
    <div className="category-tiles-container">
      <div id="category-tiles">
        {categories.map((v) => (
          <Category name={v} setEdit={setEdit} setLesson={setLesson} setViewLessonTypes={setViewLessonTypes}></Category>
        ))}
      </div>

    </div>

  );

  const editCategoryElement = (
    <div className="max-width">
      <EditCategory category={edit} userDetails={userDetails} language={language} setEdit={setEdit}></EditCategory>
    </div>
  );
  var body = <div></div>;

  if (!viewLessonTypes) {
    body = <div id="category-container-1" class="Holiday-Cheer-5-hex">
      {edit === "" && categoryElements}
      {edit !== "" && editCategoryElement}
    </div>
  } else {
    body = <div>
      <ChooseLessonType category={lesson} {...{setViewLessonTypes, userDetails, language, setViewLessonTypes}}></ChooseLessonType>
    </div>
  }

  return (
    body
  );
}

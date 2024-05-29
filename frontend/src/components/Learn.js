import "../styles/learn.css";
import "../App.css";
import Category from "./Category";
import Lesson from "./Lesson";
import EditCategory from "./EditCategory";
import { useState } from "react";

export default function Learn({ userDetails, language }) {
  const [lesson, setLesson] = useState("");
  const [edit, setEdit] = useState("");
  const categories = [
    "cafe",
    "restaurant",
    "family",
    "introductions",
    "hobbies",
  ];


  const categoryElements = (
    <div id="category-tiles">
      {categories.map((v) => (
        <Category name={v} setEdit={setEdit} setLesson={setLesson}></Category>
      ))}
    </div>
  );

  const editCategoryElement = (
    <div>
      <EditCategory category={edit} userDetails={userDetails} language={language}></EditCategory>
    </div>
  );
  var body = <div></div>;
  
  if (lesson === "") {
    body = <div id="category-container-1" class="Holiday-Cheer-5-hex">
    {edit === "" && categoryElements}
    {edit !== "" && editCategoryElement}
    </div>
  }  else {
    body = <Lesson category={ lesson } setLesson={ setLesson } userDetails={userDetails} language={language}></Lesson>;
  }

  return (
    body
  );
}

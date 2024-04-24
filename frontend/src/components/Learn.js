import "../styles/learn.css";
import "../App.css";
import Category from "./Category";
import Lesson from "./Lesson";
import EditCategory from "./EditCategory";
import { useState } from "react";

export default function Learn() {
  const [lesson, setLesson] = useState("");
  const [edit, setEdit] = useState("");
  const categories = [
    "cafe",
    "restaurant",
    "family",
    "introductions",
    "museums",
  ];

  function createCategory() {
    alert("TODO: insert create category logic here")

  }

  const createCategoryElement = (
    <div onClick={() => createCategory()} id="create-category" class="Holiday-Cheer-3-hex heading-2 create-category-button">create category</div>
  );

  const categoryElements = (
    <div id="category-tiles">
      {categories.map((v) => (
        <Category name={v} setEdit={setEdit} setLesson={setLesson}></Category>
      ))}
    </div>
  );

  const editCategoryElement = (
    <div>
      <EditCategory name={edit}></EditCategory>
    </div>
  );
  var body = <div></div>;
  
  if (lesson === "") {
    body = <div id="category-container-1" class="Holiday-Cheer-5-hex">
    {edit === "" && createCategoryElement}
    {edit === "" && categoryElements}
    {edit !== "" && editCategoryElement}
    </div>
  }  else {
    body = <Lesson name={ lesson } setLesson={ setLesson }></Lesson>;
  }

  return (
    body
  );
}

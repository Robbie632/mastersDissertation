import "../styles/learn.css";
import Category from "./Category";
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

  const createCategoryElement = (
    <div id="create-category">"create category ..."</div>
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

  return (
    <div id="category-container-1">
      {edit === "" && createCategoryElement}
      {edit === "" && categoryElements}
      {edit !== "" && editCategoryElement}
    </div>
  );
}

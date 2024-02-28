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
  if (edit === "") {
  }

  return (
    <div id="category-container-1">
      {edit === "" && <div id="create-category">"create category ..."</div>}
      <div id="category-tiles">
        {edit === "" &&
          categories.map((v) => (
            <Category
              name={v}
              setEdit={setEdit}
              setLesson={setLesson}
            ></Category>
          ))}
      </div>
      <div>{edit !== "" && <EditCategory name={edit}></EditCategory>}</div>
    </div>
  );
}

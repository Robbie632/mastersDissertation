import "../styles/learn.css";
import Category from "./Category";
import { useState } from "react";

export default function Learn() {
  const [category, setCategory] = useState("");
  const categories = ["cafe", "restaurant", "family"];

  return (
    <div className="learn-content">
      {categories.map((v) => <Category name={v} ></Category>)}
    </div>
  );
}

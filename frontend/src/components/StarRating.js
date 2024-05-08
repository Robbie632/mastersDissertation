import React, { useState } from "react";
import "../styles/starrating.css";
import { FaStar } from "react-icons/fa";
import { useEffect } from "react";

export default function StarRating({ phraseid, userid}) {
  const colors = {
    orange: "#F2C265",
    grey: "a9a9a9",
  };

  const stars = Array(5).fill(0);
  const [rating, setRating] = useState(0);
  const [hoverValue, setHoverValue] = useState(undefined);


  const handleMouseOverStar = (value) => {
    setHoverValue(value);
  };

  const handleMouseLeaveStar = () => {
    setHoverValue(undefined);
  };

  const handleClickStar = (value) => {
    setRating(value);
    alert("POST rating to /api/rating here")
  };

  const starElements = stars.map((_, index) => {
    return (
      <FaStar
        key={index}
        size={24}
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        color={(hoverValue || rating) > index ? colors.orange : colors.grey}
        onClick={() => handleClickStar(index + 1)}
        onMouseOver={() => handleMouseOverStar(index + 1)}
        onMouseLeave={() => handleMouseLeaveStar}
      />
    );
  });

  return (
    <div className="star-rating">
      { phraseid==-1 ? "" : starElements}
    </div>
  );
}

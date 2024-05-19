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
  const [hide, setHide] = useState(false);


  const handleMouseOverStar = (value) => {
    setHoverValue(value);
  };

  const handleMouseLeaveStar = () => {
    setHoverValue(undefined);
  };

  const handleClickStar = async (value) => {
    setRating(value);
    const response = await fetch("http://localhost:5000/api/rating", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phraseid: phraseid,
        userid: userid,
        rating: value,
      }),
    });
    if (response.status !== 201) {
      alert("problem sending rating");
    } else {
      setHide(true);
    }
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

  if (hide) {
    var element = <div>
      rating submitted
    </div>;
  } else {
    var element = <div className="star-rating">
      {phraseid == -1 ? "" : starElements}
    </div>;
  }
  return (
    element
  );
}

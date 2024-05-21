import React, { useState } from "react";
import "../styles/starrating.css";
import { FaStar } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { IconContext } from "react-icons";

export default function StarRating({ phraseid, userid}) {
  const colors = {
    orange: "#F2C265",
    grey: "a9a9a9",
  };

  const stars = Array(5).fill(0);
  const [rating, setRating] = useState(0);
  const [hoverValue, setHoverValue] = useState(undefined);
  // {0, 1, 2} 0: display stars 1: display tick showing rating sent, 2: loading symbol for when sent rating
  const [displayStars, setDisplayStars] = useState(0);


  const handleMouseOverStar = (value) => {
    setHoverValue(value);
  };

  const handleMouseLeaveStar = () => {
    setHoverValue(undefined);
  };

  const handleClickStar = async (value) => {
    setRating(value);
    setDisplayStars(2);
    await example();
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
      setDisplayStars(1);
    }
  };

  function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  
  async function example() {
      await sleep(4000);
      return 1;
  }

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

  if (displayStars === 1) {
    var element = <div>
      <IconContext.Provider
        value={{
          size: 52,
          color: "gold",
          className: "global-class-name",
        }}
      >
        <TiTick />
      </IconContext.Provider>
    </div>;
  } else if (displayStars === 0) {
    var element = <div className="star-rating">
      {phraseid == -1 ? "" : starElements}
    </div>;
  } else if (displayStars === 2) {
    var element = <div className="star-rating">
    sending rating...
  </div>;

  }
  return (
    element
  );
}

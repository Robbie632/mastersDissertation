import React, { useState } from "react";
import "../styles/starrating.css";
import { ENV_VARS } from "../env";
import { FaStar } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import { IconContext } from "react-icons";

export default function StarRating({ phraseid, userDetails }) {
  const colors = {
    orange: "#F2C265",
    grey: "a9a9a9",
  };

  const stars = Array(5).fill(0);
  const [hoverValue, setHoverValue] = useState(undefined);
  // {0, 1, 2} 0: display stars, 1: display tick showing rating sent, 2: loading symbol for when sent rating
  const [displayStars, setDisplayStars] = useState(0);


  const handleMouseOverStar = (value) => {
    setHoverValue(value);
  };

  const handleMouseLeaveStar = () => {
    setHoverValue(undefined);
  };

  const handleClickStar = async (value) => {
    setDisplayStars(2);
    const response = await fetch(`${ENV_VARS.REACT_APP_SERVER_IP}/api/rating`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": userDetails["token"]
      },
      body: JSON.stringify({
        phraseid: phraseid,
        userid: userDetails["userid"],
        rating: value,
      }),
    });
    if (response.status !== 201) {
      alert("problem sending rating");
    } else {
      setHoverValue(0);
      setDisplayStars(1);
    }
  };

  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  async function example() {
    await sleep(4000);
    return 1;
  }
  function onLeaveStars() {
    setHoverValue(undefined);
  }
  const starElements = stars.map((_, index) => {
    return (
      <FaStar
        key={index}
        size={24}
        color={(hoverValue) > index ? colors.orange : colors.grey}
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
      <a>rating submitted</a>
    </div>;
    setTimeout(() => setDisplayStars(0), 2000);
  } else if (displayStars === 0) {
    var element = <div className="star-rating" onMouseLeave={onLeaveStars}>
      <a>Rate Phrase</a>
      <div>
        {phraseid == -1 ? "" : starElements}
      </div>

    </div>;
  } else if (displayStars === 2) {
    var element = <div className="star-rating" onMouseLeave={onLeaveStars}>
      <AiOutlineLoading className="loading" />
    </div>;

  }
  return (
    element
  );
}

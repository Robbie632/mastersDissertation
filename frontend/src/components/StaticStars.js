import React, { useState } from "react";
import "../styles/starrating.css";
import { FaStar } from "react-icons/fa";

export default function StaticStars({ starCount }) {
    const colors = {
        orange: "#F2C265",
        grey: "a9a9a9",
    };

    const stars = Array(5).fill(0);

    const starElements = stars.map((_, index) => {
        return (
            <FaStar
                key={index}
                size={24}
                color={(starCount) > index ? colors.orange : colors.grey}
            />
        );
    });

    return (
        <div>
            {starElements}
        </div>

    );
}

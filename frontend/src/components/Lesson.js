import "../styles/lesson.css";
import "../App.css";
import React, { useState } from "react";

export default function Lesson({ name }) {
  
  const [progress, setProgress] = useState(0);

  return (
    <div class="lesson-container-1 Holiday-Cheer-5-hex">
      <div class="lesson-container-1a Holiday-Cheer-3-hex">
        <div class="lesson-container-1aa Holiday-Cheer-5-hex"></div>
        <div class="lesson-container-1ab Holiday-Cheer-5-hex"></div>
        <div class="lesson-container-1ac Holiday-Cheer-5-hex">
          <div class="heading-2">{name.toUpperCase()}</div>
        </div>
      </div>
      <div class="lesson-container-1b Holiday-Cheer-5-hex">
        <div class="lesson-container-1ba Holiday-Cheer-5-hex">
          <div class="lesson-l1">
          </div>
          <div class="lesson-l2">
          </div>
        </div>
      </div>
      <div class="lesson-container-1c Holiday-Cheer-5-hex">
        <button class="lesson-skip lesson-button Holiday-Cheer-4-hex">
          <div>SKIP</div>
        </button>
        <button class="lesson-check lesson-button Holiday-Cheer-4-hex">
          <div>CHECK</div>
        </button>
      </div>
    </div>
  );
}

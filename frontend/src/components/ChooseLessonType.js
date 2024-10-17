import FromL1Lesson from "./FromL1Lesson";

import { useState } from "react";


export default function ChooseLessonType({
    category, setViewLessonTypes, userDetails, language }) {

    const [lessonType, setLessonType] = useState("");
    var body;
    if (lessonType === "fromL1") {
        body =
            <FromL1Lesson {...{ category, setViewLessonTypes, userDetails, language }}></FromL1Lesson>


    } else if (lessonType === "fromL2") {
        body = <div>fromL2 lesson</div>;
    } else if (lessonType === "missingWords") {
        body = <div>missingWords lesson</div>;
    } else if (lessonType === "") {
        body =
            <div>
                <h2>ChooseLessonTypeDivElement</h2>
                category: {category}
                {
                    (lessonType === "") ? <ol>
                        <li onClick={() => setLessonType("fromL1")}>l1 - l2</li>
                        <li onClick={() => setLessonType("fromL2")}>l2 - l1</li>
                        <li onClick={() => setLessonType("missingWords")}>missing words</li>
                    </ol> : <div>lesson</div>
                }
            </div>

    }

    return (
        <div>
            {body}
        </div>

    )
}
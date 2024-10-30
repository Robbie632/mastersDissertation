import TranslationLesson from "./TranslationLesson";
import MissingWordsLesson from "./MissingWordsLesson";
import WordShuffleLesson from "./WordShuffleLesson";
import { PiSquaresFour } from "react-icons/pi";
import { MdOutlineClearAll } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IconContext } from "react-icons";

import "../styles/chooselessontype.css"

import { TbWriting } from "react-icons/tb";

import { useState } from "react";


export default function ChooseLessonType({
    category, setViewLessonTypes, userDetails, language }) {

    function onSelectLessonType(lessonType) {
        setLessonType(lessonType);
    }

    const [lessonType, setLessonType] = useState("");
    var body;
    if (lessonType === "fromL1") {
        body =
            <TranslationLesson fromL1={true} {...{ category, setLessonType, userDetails, language, setViewLessonTypes }}></TranslationLesson>

    } else if (lessonType === "fromL2") {
        body =
            <TranslationLesson fromL1={false} {...{ category, setLessonType, userDetails, language, setViewLessonTypes }}></TranslationLesson>

    } else if (lessonType === "missingWords") {
        body = <MissingWordsLesson {...{ category, setLessonType, userDetails, language, setViewLessonTypes }}></MissingWordsLesson>

    } else if (lessonType === "wordShuffle") {
        body =
            <WordShuffleLesson fromL1={false} {...{ category, setLessonType, userDetails, language, setViewLessonTypes }}></WordShuffleLesson>

    } else if (lessonType === "") {
        body =
            <div className="lesson-type-body">
                <div className="lessontype-back-arrow-container" >
                    <div className="lessontype-back-arrow" onClick={() => setViewLessonTypes(false)}>
                        <IconContext.Provider
                            value={{
                                size: 48,
                                color: "black",
                                className: "lessontype-back-arrow-graphic",
                            }}
                        >
                            <IoMdArrowRoundBack />
                        </IconContext.Provider>
                    </div>

                </div>
                <h1>Lesson Type</h1>
                {
                    (lessonType === "") ? <ul>
                        <li className="Holiday-Cheer-5-hex" onClick={() => onSelectLessonType("fromL1")}>
                            <h5>Writing Swedish</h5>
                            <div className="lesson-type-icon">
                                <IconContext.Provider
                                    value={{
                                        size: 100,
                                        color: "black",
                                        className: "global-class-name",
                                    }}
                                >
                                    <TbWriting />
                                </IconContext.Provider>
                            </div>
                        </li>
                        <li className="Holiday-Cheer-5-hex" onClick={() => onSelectLessonType("fromL2")}>
                            <h5>
                                Writing English
                            </h5>
                            <div className="lesson-type-icon">
                                <IconContext.Provider
                                    value={{
                                        size: 100,
                                        color: "black",
                                        className: "global-class-name",
                                    }}
                                >
                                    <TbWriting />
                                </IconContext.Provider>
                            </div>
                        </li>
                        <li className="Holiday-Cheer-5-hex" onClick={() => onSelectLessonType("missingWords")}>
                            <h5>Missing words</h5>
                            <div>
                                <IconContext.Provider
                                    value={{
                                        size: 100,
                                        color: "black",
                                        className: "global-class-name",
                                    }}
                                >
                                    <MdOutlineClearAll />
                                </IconContext.Provider>
                            </div>
                        </li>
                        <li className="Holiday-Cheer-5-hex" onClick={() => onSelectLessonType("wordShuffle")}>
                            <h5>Word shuffle</h5>
                            <div>
                                <IconContext.Provider
                                    value={{
                                        size: 100,
                                        color: "black",
                                        className: "global-class-name",
                                    }}
                                >
                                    <PiSquaresFour />
                                </IconContext.Provider>
                            </div>
                        </li>
                    </ul> : <div>lesson</div>
                }
            </div>

    }

    return (
        <div>
            {body}
        </div>

    )
}
import "../App.css";
import "../styles/about.css";

export default function About() {
  return (
    <div>
      <div className="about-text">
        <div>
          This web app is being developed by Robert Morse for his MSc in
          Computer Science dissertation, titled:
        </div>
        <div className="title">
          The specification, design, implementation and evaluation of a language
          learning platform that tests user-generated content in a gamified
          manner for self-directed learning.
        </div>

        <div>
          The aim of the project is the design and testing of a web application
          for self-driven language learners. The web application facilitates the
          learning of user-added vocabulary. Users can add their own phrases,
          as well as browse phrases added by other users. In addition, users can rate phrases.
        </div>
        <div>
          Users can then do lessons that test they're vocabulary
          for a specific category. The hope is for a more
          personalised learning journey that can be updated to personal goals
        </div>
      </div>
    </div>
  );
}

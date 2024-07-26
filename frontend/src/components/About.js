import "../App.css";
import "../styles/about.css";

export default function About() {
  return (
    <div>
      <div className="about-text">
        <div>
        <div>
          This web app is being developed by Robert Morse for his MSc in
            Computer Science dissertation, titled:
          </div>
          <br></br>
        <div className="title">
          The specification, design, implementation and evaluation of a language
          learning platform that tests user-generated content in a gamified
          manner for self-directed learning.
        </div>
          <h2>Instructions for use</h2>
          <ul>
            <li>
              Please note this web application is only suitable for use on computers/laptops.
            </li>
            <li>
              Please head to the ACOUNT page in order to sign up using your
              email and password.
            </li>
            <li>You will then be able to login.</li>
            <li>
              Once logged in you can either head to the BROWSE page in order to
              browse phrases added by other users, if you want to add a phrase
              pair to your learning then click GET PHRASE. Alternatively, you
              can add phrase pairs of your own, simply head to the LEARN page
              then click "edit phrases" ,you will then be able to add, remove and
              edit phrases if you wish.
            </li>
            <li>
              In order to practise phrase pair translations, simply navigate to
              the LEARN page and select the category you would like to practise.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

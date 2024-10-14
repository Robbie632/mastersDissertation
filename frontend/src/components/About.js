import "../App.css";
import "../styles/about.css";

export default function About() {
  return (
    <div>
      <div className="about-text">
        <div>
          <h2>Introduction</h2>
          <p>
            This web application is being developed by Robert Morse for his MSc in
            Computer Science dissertation, titled:
          </p>
          <p className="title">
            The specification, design, implementation and evaluation of a language
            learning platform that tests user-generated content in a gamified
            manner for self-directed learning.
          </p>

          <h2>Instructions for use</h2>
         
            <p>
              Please note this web application is only suitable for use on computers/laptops.
            </p>
            <p>
              Please head to the <span>ACOUNT</span> page in order to sign up using your
              email and password.
            </p>
            <p>You will then be able to login.</p>
            <p>
              Once logged in you can either head to the <span>BROWSE</span> page in order to
              browse phrases added by other users, if you want to add a phrase
              pair to your learning then click <span>GET PHRASE</span>. Alternatively, you
              can add phrase pairs of your own, simply head to the <span>LEARN</span> page
              then click <span>edit phrases</span>, you will then be able to add, remove and
              edit phrases if you wish.
            </p>
            <p>
              In order to practise phrase pair translations, simply navigate to
              the <span>LEARN</span> page and select the category you would like to practise.
            </p>
            <p>
              Please try to rate as many phrases as possible via the <span>BROWSE</span> page,
              this will help with the analysis of the web application's effectiveness.
            </p>
     
        </div>
      </div>
    </div>
  );
}

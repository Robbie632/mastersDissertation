import "./App.css";
import "./components/Menu";
import Menu from "./components/Menu";
import Learn from "./components/Learn";
import Browse from "./components/Browse";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebaseConfig";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = firebase.auth();

function App() {
  const [menuSelection, setMenuSelection] = useState("learn");
  const [loggedIn, setLoggedIn] = useState(false);
  const [signedUp, setSignedUp] = useState(false);
  const [userDetails, setUserDetails] = useState({});

  return (
    <div className="App">
      <div>
        <Menu setMenuSelection={setMenuSelection}></Menu>
      </div>
      {menuSelection === "learn" && <Learn></Learn>}
      {menuSelection === "browse" && <Browse></Browse>}
      {menuSelection === "login" && <Login></Login>}
      {menuSelection === "signup" && <SignUp></SignUp>}
    </div>
  );
}

export default App;

import './App.css';
import "./components/Menu";
import Menu from './components/Menu';
import React, { useState } from "react";

function App() {
  const [headerSelection, setHeaderSelection] = useState(0);
  const [loggedIn, setLoggedIn] = useState(0);
  const [signedUp, setSignedUp] = useState(0);
  const [userDetails, setUserDetails] = useState({});
  return (
    <div className="App">
      <Menu>
      </Menu>
    </div>
  );
}

export default App;

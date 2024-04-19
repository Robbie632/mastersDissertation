import "../styles/menu.css";

export default function Menu({ setMenuSelection, setLanguage, language}) {
  return (
    <header className="App-header Holiday-Cheer-1-hex heading-1">
      <div className="menu-button" onClick={() => setMenuSelection("learn") } >Learn</div>
      <div className="menu-button" onClick={() => setMenuSelection("browse") }>Browse</div>
      <div className="menu-button" onClick={() => setMenuSelection("login")}>Login</div>
      <div className="menu-button" onClick={() => setMenuSelection("signup") }>Signup</div>
      <div className="current-language">language: {language}</div>
    </header>
  );
}

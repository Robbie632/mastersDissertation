import "../styles/menu.css";

export default function Menu({ setMenuSelection, setLanguage, language}) {
  return (
    <header className="App-header">
      <div onClick={() => setMenuSelection("learn") } >Learn</div>
      <div onClick={() => setMenuSelection("browse") }>Browse</div>
      <div onClick={() => setMenuSelection("login")}>Login</div>
      <div onClick={() => setMenuSelection("signup") }>Signup</div>
      <div>language:{ language}</div>
    </header>
  );
}

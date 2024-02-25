import "../styles/menu.css";

export default function Menu({ setMenuSelection}) {
  return (
    <header className="App-header">
      <div onClick={() => setMenuSelection("learn") } >Learn</div>
      <div onClick={() => setMenuSelection("browse") }>Browse</div>
      <div onClick={() => setMenuSelection("account") }>Account</div>
      <div>flag</div>
    </header>
  );
}

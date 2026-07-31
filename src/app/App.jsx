import { useState } from "react";
import Bloom from "../components/Bloom";
import Compost from "../components/Compost";
import Compose from "../components/Compose";
import Deposit from "../components/Deposit";
import Home from "../components/Home";
import Result from "../components/Result";
import resources from "../data/resources.json";
import "../styles/global.css";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [chosen, setChosen] = useState([]);

  const restart = () => {
    setChosen([]);
    setScreen("home");
  };

  return (
    <div className={`app screen-${screen}`}>
      <header className="site-header" aria-label="NOA SOUCI">
        <button className="wordmark" onClick={restart}>NOA <span>SOUCI</span></button>
        <span className="stage-mark" aria-hidden="true">{["home", "deposit", "compost", "bloom", "compose", "result"].indexOf(screen) + 1} / 6</span>
      </header>
      {screen === "home" && <Home onStart={() => setScreen("deposit")} />}
      {screen === "deposit" && <Deposit onBack={() => setScreen("home")} onSubmit={() => setScreen("compost")} />}
      {screen === "compost" && <Compost onComplete={() => setScreen("bloom")} />}
      {screen === "bloom" && <Bloom resources={resources} onContinue={(items) => { setChosen(items); setScreen("compose"); }} />}
      {screen === "compose" && <Compose initialItems={chosen} onBack={() => setScreen("bloom")} onComplete={(items) => { setChosen(items); setScreen("result"); }} />}
      {screen === "result" && <Result items={chosen} onRestart={restart} />}
    </div>
  );
}

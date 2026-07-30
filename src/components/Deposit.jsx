import { useState } from "react";

export default function Deposit({ onBack, onSubmit }) {
  const [value, setValue] = useState("");
  return <main className="screen deposit-screen">
    <button className="back" onClick={onBack}>← Revenir</button>
    <p className="eyebrow">Déposer</p>
    <h1>Quel souci souhaites-tu<br />confier à NOA&nbsp;?</h1>
    <form onSubmit={(event) => { event.preventDefault(); if (value.trim()) onSubmit(value.trim()); }}>
      <label className="sr-only" htmlFor="concern">Ton souci</label>
      <textarea id="concern" autoFocus maxLength={500} value={value} onChange={(event) => setValue(event.target.value)} placeholder="Écris ici, simplement…" />
      <div className="form-foot"><small>{value.length} / 500</small><button className="primary" disabled={!value.trim()}>Confier <span aria-hidden="true">↓</span></button></div>
    </form>
    <p className="privacy">Tes mots restent dans cet instant et ne sont pas enregistrés.</p>
  </main>;
}

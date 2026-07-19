import { useState } from "react";
import Button from "../components/Button";
import VideoIntro from "../components/VideoIntro";
import { homeContent } from "../content/home";

export default function Home({ actions, profile }) {
  const [pseudonym, setPseudonym] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSaving(true);
    try {
      const credentials = { pseudonym, email, password };
      if (isLogin) {
        await actions.login(credentials);
      } else {
        await actions.createAccount(credentials);
      }
    } catch (saveError) {
      setError(saveError.message || "Impossible de continuer.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="page">
      <VideoIntro />

      {profile ? (
        <div className="welcome-profile">
          <p>Bienvenue, <strong>{profile.pseudonym}</strong>.</p>
          <button type="button" onClick={actions.openAccount}>
            Voir mon compte
          </button>
        </div>
      ) : (
        <form className="profile-form" onSubmit={handleAuthSubmit}>
          <p className="eyebrow">Avant d'embarquer</p>
          {!isLogin && (
            <>
              <label htmlFor="pseudonym">Choisis ton pseudo</label>
              <input
                id="pseudonym"
                name="pseudonym"
                value={pseudonym}
                onChange={(event) => setPseudonym(event.target.value)}
                placeholder="Ex. NaoRêve"
                autoComplete="nickname"
                maxLength="24"
                disabled={isSaving}
                required
              />
            </>
          )}
          <label htmlFor="email">Adresse email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            disabled={isSaving}
            required
          />
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={isLogin ? "current-password" : "new-password"}
            disabled={isSaving}
            required
          />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-button" type="submit" disabled={isSaving}>
            {isSaving
              ? isLogin
                ? "Connexion…"
                : "Création du compte…"
              : isLogin
                ? "Se connecter"
                : "Créer mon compte"}
          </button>
          <button
            className="text-button"
            type="button"
            onClick={() => {
              setError("");
              setIsLogin((value) => !value);
            }}
            disabled={isSaving}
          >
            {isLogin ? "Créer un compte" : "Déjà un compte ? Se connecter"}
          </button>
        </form>
      )}

      <p className="page-text">{homeContent.instruction}</p>

      <Button onClick={actions.scan} disabled={!profile}>
        {profile ? homeContent.scanButton : "Crée ton compte pour commencer"}
      </Button>

      <p className="small-text">{homeContent.footer}</p>
    </section>
  );
}

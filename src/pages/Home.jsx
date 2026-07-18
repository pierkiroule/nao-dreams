import { useState } from "react";
import Button from "../components/Button";
import VideoIntro from "../components/VideoIntro";
import { homeContent } from "../content/home";
import { validatePseudonym } from "../services/profileService";

export default function Home({ actions, profile }) {
  const [pseudonym, setPseudonym] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleProfileSubmit(event) {
    event.preventDefault();
    const validationError = validatePseudonym(pseudonym);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setIsSaving(true);
    try {
      await actions.createProfile(pseudonym);
    } catch (saveError) {
      setError(saveError.message || "Impossible de créer le compte.");
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
        <form className="profile-form" onSubmit={handleProfileSubmit}>
          <p className="eyebrow">Avant d'embarquer</p>
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
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-button" type="submit" disabled={isSaving}>
            {isSaving ? "Création du compte…" : "Créer mon compte"}
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

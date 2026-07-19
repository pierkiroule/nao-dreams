import Button from "../components/Button";
import VideoIntro from "../components/VideoIntro";
import { homeContent } from "../content/home";

export default function Home({ actions, profile, isStarting, startError }) {
  return (
    <section className="page">
      <VideoIntro />

      {profile ? (
        <div className="welcome-profile">
          <p>Ton identité onirique est prête</p>
          <p className="dream-pseudonym">{profile.pseudonym}</p>
          {profile.locationLabel && (
            <p className="location-label">{profile.locationLabel}</p>
          )}
          <button type="button" onClick={actions.openAccount}>
            Voir mon compte
          </button>
        </div>
      ) : isStarting ? (
        <div className="welcome-profile" aria-live="polite">
          <p>NAO prépare ton identité onirique…</p>
        </div>
      ) : (
        <div className="welcome-profile">
          <p className="form-error" role="alert">{startError}</p>
          <button type="button" onClick={actions.retryStart}>
            Réessayer
          </button>
        </div>
      )}

      <p className="page-text">{homeContent.instruction}</p>

      <Button onClick={actions.scan} disabled={!profile}>
        {profile ? "Commencer la traversée" : "Préparation de NAO…"}
      </Button>

      <p className="small-text">{homeContent.footer}</p>
    </section>
  );
}

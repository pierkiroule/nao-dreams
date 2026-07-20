import Button from "../components/Button";
import VideoIntro from "../components/VideoIntro";

export default function Home({ actions, profile, isStarting, startError }) {
  return <section className="page home-page">
    <VideoIntro />
    <h2 className="page-title">Entre dans un rêve impossible.</h2>
    {profile ? <Button onClick={actions.startDream}>Entrer dans le réseau poétique</Button> : isStarting ? <p className="small-text" aria-live="polite">NAO ouvre les rideaux de la nuit…</p> : <><p className="form-error" role="alert">{startError}</p><Button onClick={actions.retryStart}>Réessayer</Button></>}
    {profile && <button className="account-link" type="button" onClick={actions.openAccount}>Compte de {profile.pseudonym}</button>}
  </section>;
}

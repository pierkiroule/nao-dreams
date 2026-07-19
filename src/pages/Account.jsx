import Button from "../components/Button";

function formatDate(value) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
  }).format(new Date(value));
}

export default function Account({ profile, journey, actions }) {
  const hasDream = Boolean(journey.dream);

  return (
    <section className="page account-page">
      <p className="eyebrow">Carnet de rêve</p>
      <h2 className="page-title">Le compte de {profile.pseudonym}</h2>
      <article className="account-card">
        <dl className="account-details">
          <div>
            <dt>Pseudo</dt>
            <dd>{profile.pseudonym}</dd>
          </div>
          <div>
            <dt>À bord depuis</dt>
            <dd>{formatDate(profile.createdAt)}</dd>
          </div>
          <div>
            <dt>Rêves commencés</dt>
            <dd>{hasDream ? "1" : "0"}</dd>
          </div>
          <div>
            <dt>NAO</dt>
            <dd>{journey.naoId}</dd>
          </div>
        </dl>
      </article>
      <Button onClick={actions.closeAccount} variant="secondary">
        Retour à l'accueil
      </Button>
    </section>
  );
}

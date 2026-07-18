import Button from "../components/Button";
import { mockJourney } from "../data/mockJourney";
import { JOURNEY_STATUS } from "../config/constants";
import { oceanContent } from "../content/ocean";

export default function Ocean({
  journey,
  actions,
}) {
  const guardians =
    mockJourney.guardians +
    (journey.status === JOURNEY_STATUS.PASSED
      ? 1
      : 0);

  const resources =
    mockJourney.resources +
    Object.keys(journey.selections ?? {}).length;

  const dreamBubbles =
    mockJourney.dreamBubbles +
    (journey.dream ? 1 : 0);

  return (
    <section className="page">
      <h1 className="page-title">
        {oceanContent.title}
      </h1>

      <article className="ocean-card">
        <p className="small-text">
          {mockJourney.seriesName}
        </p>

        <div className="stats">
          <div className="stat">
            <strong>{guardians}</strong>
            {oceanContent.labels.guardians}
          </div>

          <div className="stat">
            <strong>{resources}</strong>
            {oceanContent.labels.resources}
          </div>

          <div className="stat">
            <strong>{dreamBubbles}</strong>
            {oceanContent.labels.bubbles}
          </div>

          <div className="stat">
            <strong>{journey.naoId}</strong>
            {oceanContent.labels.traveller}
          </div>
        </div>
      </article>

      <p className="page-text">
        {oceanContent.description}
      </p>

      <Button
        variant="secondary"
        onClick={actions.restart}
      >
        {oceanContent.restartButton}
      </Button>
    </section>
  );
}

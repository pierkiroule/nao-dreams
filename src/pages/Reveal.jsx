import Bubble from "../components/Bubble";
import Button from "../components/Button";
import { revealContent } from "../content/reveal";

export default function Reveal({
  journey,
  actions,
}) {
  return (
    <section className="page">
      <h1 className="page-title">
        {revealContent.title}
      </h1>

      <Bubble>
        <p className="dream-text">
          {journey.dream || revealContent.fallback}
        </p>
      </Bubble>

      <p className="page-text">
        {revealContent.invitation}
        <br />
        {revealContent.closing}
      </p>

      <div className="actions">
        <Button onClick={actions.openDreamDepth}>
          {revealContent.depthButton}
        </Button>

        <Button
          variant="secondary"
          onClick={actions.continueToPass}
        >
          {revealContent.continueButton}
        </Button>
      </div>
    </section>
  );
}

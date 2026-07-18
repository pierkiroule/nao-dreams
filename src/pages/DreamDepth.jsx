import Button from "../components/Button";
import { FEATURES } from "../config/features";
import {
  dreamDepthContent,
} from "../content/dreamDepth";

export default function DreamDepth({ actions }) {
  return (
    <section className="page">
      <h1 className="page-title">
        {dreamDepthContent.title}
      </h1>

      {dreamDepthContent.features.map(
        (feature) => (
          <article
            className="ocean-card"
            key={feature.id}
          >
            <h2>{feature.title}</h2>
            <p className="page-text">
              {feature.text}
            </p>
          </article>
        ),
      )}

      <Button disabled={!FEATURES.dreamDepth}>
        {dreamDepthContent.premiumButton}
      </Button>

      <Button
        variant="secondary"
        onClick={actions.continueToPass}
      >
        {dreamDepthContent.continueButton}
      </Button>
    </section>
  );
}

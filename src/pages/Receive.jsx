import Boat from "../components/Boat";
import Button from "../components/Button";
import { receiveContent } from "../content/receive";

export default function Receive({ actions }) {
  return (
    <section className="page">
      <h1 className="page-title">
        {receiveContent.title}
      </h1>

      <Boat />

      <p className="page-text">
        {receiveContent.paragraphs.map((paragraph) => (
          <span key={paragraph}>
            {paragraph}
            <br />
          </span>
        ))}
      </p>

      <Button onClick={actions.embark}>
        {receiveContent.button}
      </Button>

      <p className="small-text">
        {receiveContent.footer}
      </p>
    </section>
  );
}

import Button from "../components/Button";
import { passContent } from "../content/pass";

export default function Pass({ actions }) {
  return (
    <section className="page">
      <h1 className="page-title">
        {passContent.title}
      </h1>

      <p className="page-text">
        {passContent.introduction}
        <br />
        {passContent.invitation}
      </p>

      <p className="page-text">
        {passContent.instruction}
      </p>

      <Button onClick={actions.confirmPass}>
        {passContent.button}
      </Button>

      <p className="small-text">
        {passContent.signature}
      </p>
    </section>
  );
}

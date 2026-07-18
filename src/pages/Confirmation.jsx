import Boat from "../components/Boat";
import Button from "../components/Button";
import {
  confirmationContent,
} from "../content/confirmation";

export default function Confirmation({
  actions,
}) {
  return (
    <section className="page">
      <Boat />

      <h1 className="page-title">
        {confirmationContent.title}
      </h1>

      <p className="page-text">
        {confirmationContent.text}
      </p>

      <Button onClick={actions.openOcean}>
        {confirmationContent.button}
      </Button>

      <p className="small-text">
        {confirmationContent.signature}
      </p>
    </section>
  );
}

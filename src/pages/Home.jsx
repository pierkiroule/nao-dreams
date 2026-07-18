import Button from "../components/Button";
import VideoIntro from "../components/VideoIntro";
import { homeContent } from "../content/home";

export default function Home({ actions }) {
  return (
    <section className="page">
      <VideoIntro />

      <p className="page-text">
        {homeContent.instruction}
      </p>

      <Button onClick={actions.scan}>
        {homeContent.scanButton}
      </Button>

      <p className="small-text">
        {homeContent.footer}
      </p>
    </section>
  );
}

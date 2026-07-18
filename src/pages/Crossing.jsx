import { useEffect, useState } from "react";
import Boat from "../components/Boat";
import { DREAM_CONFIG } from "../config/dream";
import { crossingContent } from "../content/crossing";

export default function Crossing({ actions }) {
  const [messageIndex, setMessageIndex] =
    useState(0);

  useEffect(() => {
    const messageTimer = window.setInterval(() => {
      setMessageIndex((currentIndex) =>
        Math.min(
          currentIndex + 1,
          crossingContent.messages.length - 1,
        ),
      );
    }, DREAM_CONFIG.crossingMessageDuration);

    const navigationTimer = window.setTimeout(() => {
      actions.finishCrossing();
    }, DREAM_CONFIG.crossingDuration);

    return () => {
      window.clearInterval(messageTimer);
      window.clearTimeout(navigationTimer);
    };
  }, [actions]);

  return (
    <section className="page">
      <Boat />

      <h1 className="page-title">
        {crossingContent.messages[messageIndex]}
      </h1>

      {import.meta.env.DEV && (
        <p className="small-text">
          {crossingContent.developerNote}
        </p>
      )}
    </section>
  );
}

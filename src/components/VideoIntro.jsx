import { useRef, useState } from "react";

export default function VideoIntro() {
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);

  async function startVideo() {
    const video = videoRef.current;

    if (!video || started) {
      return;
    }

    try {
      video.muted = false;
      await video.play();
      setStarted(true);
    } catch (error) {
      console.error("Impossible de démarrer la vidéo.", error);
    }
  }

  return (
    <div className="porthole">
      <video
        ref={videoRef}
        className="porthole-video"
        playsInline
        preload="metadata"
        onEnded={() => setStarted(false)}
      >
        <source src="/videos/nao.mp4" type="video/mp4" />
      </video>

      {!started && (
        <button
          type="button"
          className="porthole-play"
          onClick={startVideo}
          aria-label="Lire la vidéo avec le son"
        >
          <span className="porthole-play-icon" aria-hidden="true" />
        </button>
      )}

      <div className="porthole-glass" aria-hidden="true" />
    </div>
  );
}

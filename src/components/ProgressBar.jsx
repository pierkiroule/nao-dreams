export default function ProgressBar({ progress }) {
  return (
    <div
      className="progress"
      aria-label={`Étape ${progress.current} sur ${progress.total}`}
    >
      <div className="progress-track">
        <div
          className="progress-value"
          style={{ width: `${progress.percentage}%` }}
        />
      </div>

      <span className="progress-label">
        {progress.current}/{progress.total}
      </span>
    </div>
  );
}

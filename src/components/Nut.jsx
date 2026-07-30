export default function Nut({ composting = false }) {
  return (
    <div className={`noa-nut${composting ? " is-composting" : ""}`} aria-label="NOA, une noix" role="img">
      <span className="nut-half nut-left" />
      <span className="nut-half nut-right" />
      <i className="nut-seam" />
    </div>
  );
}

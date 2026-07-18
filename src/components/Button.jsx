export default function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
}) {
  const className =
    variant === "secondary" ? "secondary-button" : "primary-button";

  return (
    <button
      className={className}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

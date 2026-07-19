import { APP_CONFIG } from "../config/app";

export default function Layout({
  children,
}) {
  return (
    <main className="app-shell">
      <header className="brand">
        <h1 className="brand-title">
          {APP_CONFIG.name}
        </h1>

        <p className="brand-subtitle">
          {APP_CONFIG.subtitle}
        </p>
      </header>

      {children}
    </main>
  );
}

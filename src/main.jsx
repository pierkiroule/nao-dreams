import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { migrateLocalStorage } from "./lib/localData";
import "./styles/global.css";

await migrateLocalStorage();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

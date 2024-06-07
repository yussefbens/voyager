import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { getAndroidNavMode, isNative } from "./helpers/device";

(async () => {
  try {
    await getAndroidNavMode();
  } finally {
    const container = document.getElementById("root");
    const html = document.documentElement;
    const root = createRoot(container as HTMLElement);
    const lang = localStorage.getItem("i18nextLng");
    if (container) {
      if (lang === "ar") {
        //container.style.direction = "ltr"
        //container.setAttribute("dir", "ltr")
        html.setAttribute("dir", "rtl")
      } else {
        //container.style.direction = "rtl"
        //container.setAttribute("dir", "rtl")
        html.setAttribute("dir", "ltr")
      }
    }

    root.render(
      <React.StrictMode>
        <Suspense fallback={<div>Loading...</div>}>
          <App />
        </Suspense>
      </React.StrictMode>,
    );
  }
})();

(async () => {
  // Native apps should silently accept without user prompt
  if (isNative()) await navigator.storage.persist();
})();

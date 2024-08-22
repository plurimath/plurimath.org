import { Initialize, inputTimeouts } from "./core.js";

Initialize();

(() => {
  document.querySelector("#fromfmt").addEventListener("change", inputTimeouts);
})();

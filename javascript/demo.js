import { Initialize, Plurimath, converter } from "./core.js";

(() => {
  Initialize();
  document.querySelector("#fromfmt").addEventListener("focus", () => {
    event.target.dataset.pre_selected = event.target.value
    document.removeEventListener("focus", event.target)
  });
  document.querySelector("#fromfmt").addEventListener("change", changeInputValue);
})();


function changeInputValue() {
  const pre_selected = this.dataset.pre_selected
  this.dataset.pre_selected = this.value
  converter(pre_selected, this.value)
}

import { Initialize, converter, capitalize } from "./core.js";

(() => {
  Initialize();
  document.querySelector("#fromfmt").addEventListener("focus", () => {
    event.target.dataset.pre_selected = event.target.value;
    document.removeEventListener("focus", event.target);
  });
  document.querySelector("#fromfmt").addEventListener("change", changeInputValue);
})();


function changeInputValue() {
  const pre_selected = this.dataset.pre_selected;
  this.dataset.pre_selected = this.value;
  const [from, pm] = converter(pre_selected)
  from.value = pm["to"+capitalize(this.value)]();
}

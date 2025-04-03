import { converter, insertMathJax, capitalize, inputTimeouts } from "./core.js";

(() => {
  document.addEventListener("DOMContentLoaded", demoConvert);
  document.querySelector("#swap-button").addEventListener("click", swapInputOutput)
  document.querySelector("#engine-toggle").addEventListener("change", updateEngineName);
  document.querySelector("#from").addEventListener("input", function(event) { inputTimeouts(event, demoConvert) });
  document.querySelector("#tofmt").addEventListener("change", function (event) { inputTimeouts(event, demoConvert) });
  document.querySelector("#fromfmt").addEventListener("focus", () => {
    event.target.dataset.pre_selected = event.target.value;
    document.removeEventListener("focus", event.target);
  });
  document.querySelector("#fromfmt").addEventListener("change", changeInputValue);
})();


function changeInputValue() {
  const pre_selected = this.dataset.pre_selected;
  this.dataset.pre_selected = this.value;
  const [from, pm] = converter(pre_selected, demoEngine)
  from.value = pm["to"+capitalize(this.value)]();
}

function changeDemoEngine() {
  const isMathJax = demoEngine(true);
  if (isMathJax) { return insertMathJax() }

  const script = document.getElementById("MathJax-script");
  if (!isMathJax && !script) return;

  const preview = document.getElementById("preview")
  document.head.removeChild(script);

  preview.innerHTML = preview.getAttribute("math-content")
}

function demoConvert() {
  const overlay = document.getElementById("overlay")
  const loader = document.getElementById("loader")
  loader.style.display = "block";
  overlay.style.display = "block";
  setTimeout(() => {
    changeDemoEngine()
    converter(document.getElementById("fromfmt").value, demoEngine)
    loader.style.display = "none";
    overlay.style.display = "none";
  }, 1)
}

function updateEngineName() {
  const engineNameElement = document.querySelector("#toggle-state")
  engineNameElement.innerHTML = demoEngine(true) ? "MathJax" : "Browser native"
  changeDemoEngine();
}

function demoEngine(returnBoolean = false) {
  const isMathJax = document.getElementById("engine-toggle").checked
  if (returnBoolean) { return isMathJax }

  return isMathJax ? "mathjax" : "mathml" 
}

function swapInputOutput() {
  event.preventDefault();
  const toValueForFrom = document.querySelector("#to").value
  const toFmt = document.querySelector("#tofmt")
  const fromFmt = document.querySelector("#fromfmt")
  const tofmtSelectedIndex = toFmt.selectedIndex
  const fromFmtSelectedIndex = fromFmt.selectedIndex
  document.querySelector("#from").value = toValueForFrom
  toFmt.selectedIndex = fromFmtSelectedIndex
  fromFmt.selectedIndex = tofmtSelectedIndex
  demoConvert()
}
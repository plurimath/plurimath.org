import { converter, insertMathJax, capitalize, inputTimeouts } from "./core.js";

(() => {
  const fromfmt = document.querySelector("#fromfmt")
  document.addEventListener("DOMContentLoaded", demoConvert);
  document.querySelector("#swap-button").addEventListener("click", swapInputOutput)
  document.querySelector("#engine-toggle").addEventListener("change", updateEngineName);
  document.querySelector("#from").addEventListener("input", function(event) {
    if (document.querySelector("#fromfmt").value == "latex"){
      updateSpecialCharacters(event);
    }
    inputTimeouts(event, demoConvert);
  });
  document.querySelector("#tofmt").addEventListener("change", function (event) { inputTimeouts(event, demoConvert) });
  fromfmt.addEventListener("focus", () => {
    event.target.dataset.pre_selected = event.target.value;
    document.removeEventListener("focus", event.target);
  });
  fromfmt.addEventListener("change", changeInputValue);
  document.querySelector("#display-intent").addEventListener("change", demoConvert);
})();


function changeInputValue() {
  if (document.querySelector("#from").value.trim("") == "") return;

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
  mathmlIntent()
  changeDemoEngine();
  converter(document.getElementById("fromfmt").value, demoEngine);
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

function mathmlIntent() {
  const to = document.getElementById("tofmt");
  const mathmlIntent = document.getElementById("mathml-intent");
  const displayProperty = to.value == "Mathml" ? "block" : "none";
  mathmlIntent.style.display = displayProperty;
}

function updateSpecialCharacters(event) {
  if (event.inputType.includes("delete")) { return };

  const SPECIAL_CHARACTERS = ["&", "-", "=", "+", "#", "@", "!", ",", "."];
  const input = event.target;
  
  // Add backslash before special chars only if not already escaped
  input.value = input.value.split('').map((char, i, arr) => {
    if (SPECIAL_CHARACTERS.includes(char) && arr[i-1] !== '\\') {
      return '\\' + char;
    }
    return char;
  }).join('');
}

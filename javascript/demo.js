import { converter, renderPreview, capitalize, inputTimeouts, flashMessage } from "./core.js";

(() => {
  const fromfmt = document.querySelector("#fromfmt")
  fromfmt.dataset.pre_selected = fromfmt.value;
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
  fromfmt.addEventListener("change", changeInputValue);
  document.querySelector("#display-intent").addEventListener("change", demoConvert);
})();


function changeInputValue() {
  if (document.querySelector("#from").value.trim() === "") {
    this.dataset.pre_selected = this.value;
    return;
  }

  const overlay = document.getElementById("overlay")
  const loader = document.getElementById("loader")
  loader.style.display = "block";
  overlay.style.display = "block";
  setTimeout(() => {
    try {
      const pre_selected = this.dataset.pre_selected;
      this.dataset.pre_selected = this.value;
      const [from, pm] = converter(pre_selected, demoEngine)
      const format = this.value === "unicode" ? "Unicodemath" : capitalize(this.value);
      from.value = pm["to"+format]();
      demoConvert();
    }
    catch (error) {
      console.error(error);
      flashMessage();
    }
    finally {
      loader.style.display = "none";
      overlay.style.display = "none";
    }
  }, 1)
}

function changeDemoEngine() {
  renderPreview(demoEngine());
}

function demoConvert() {
  const overlay = document.getElementById("overlay")
  const loader = document.getElementById("loader")
  loader.style.display = "block";
  overlay.style.display = "block";
  setTimeout(() => {
    try {
      mathmlIntent()
      changeDemoEngine()
      converter(document.getElementById("fromfmt").value, demoEngine)
    }
    catch (error) {
      console.error(error);
      flashMessage();
    }
    finally {
      loader.style.display = "none";
      overlay.style.display = "none";
    }
  }, 1)
}

function updateEngineName() {
  const engineNameElement = document.querySelector("#toggle-state")
  engineNameElement.innerHTML = isDemoEngineMathJax() ? "MathJax" : "Browser native"
  changeDemoEngine();
}

function demoEngine(returnBoolean = false) {
  const isMathJax = document.getElementById("engine-toggle").checked
  if (returnBoolean) { return isMathJax }

  return isMathJax ? "mathjax" : "mathml" 
}

function isDemoEngineMathJax() {
  return document.getElementById("engine-toggle").checked
}

function swapInputOutput(event) {
  event.preventDefault();
  const toValueForFrom = document.querySelector("#to").value
  const toFmt = document.querySelector("#tofmt")
  const fromFmt = document.querySelector("#fromfmt")
  const tofmtSelectedIndex = toFmt.selectedIndex
  const fromFmtSelectedIndex = fromFmt.selectedIndex
  document.querySelector("#from").value = toValueForFrom
  toFmt.selectedIndex = fromFmtSelectedIndex
  fromFmt.selectedIndex = tofmtSelectedIndex
  fromFmt.dataset.pre_selected = fromFmt.value;
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

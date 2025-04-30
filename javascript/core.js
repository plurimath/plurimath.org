import Plurimath from "./plurimath-js/dist/index.js";

function Initialize() {
  document.addEventListener("DOMContentLoaded", convert);
  document.querySelector("#mathmlEngine").addEventListener("change", changeEngine);
  document.querySelector("#from").addEventListener("input", inputTimeouts);
  document.querySelector("#tofmt").addEventListener("change", inputTimeouts);
}

function convert(){
  changeEngine();
  converter(document.getElementById("fromfmt").value);
}

function changeEngine() {
  const selectedValue = currentEngine();
  if (selectedValue == "mathjax") { return insertMathJax() }

  const script = document.getElementById("MathJax-script");
  if (selectedValue !== "mathjax" && !script) return;

  const preview = document.getElementById("preview")
  document.head.removeChild(script);

  preview.innerHTML = preview.getAttribute("math-content")
}

function insertMathJax() {
  if (document.getElementById("MathJax-script")) return;

  const element = document.createElement("script");
  element.id = "MathJax-script";
  element.type = "text/javascript";
  element.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
  element.async = true;
  document.head.appendChild(element);
  window.MathJax = {
    startup: {
      ready: () => {
        MathJax.startup.defaultReady();
        console.info('MathJax is loaded, initialized, and the initial typeset is queued');
      }
    }
  }
}

function inputTimeouts(event, callableFunction = convert) {
  if (event.timeout) { clearTimeout(event.timeout) };
  event.timeout = setTimeout(callableFunction, 1000);
}

function converter(from_fmt, mathmlEngine = currentEngine) {
  const to = document.getElementById("to");
  const from = document.getElementById("from");
  const tofmt = document.getElementById("tofmt").value;
  const pre_render = document.getElementById("preview");
  const math_tree  = document.getElementById("math_tree");
  const intent_box = document.getElementById("display-intent");

  // empty result
  to.value = "";
  pre_render.innerText = "";
  math_tree.value = "";

  if(from.value.trim() == "") return;

  const pm = new Plurimath(from.value, from_fmt);
  const mathml = pm.toMathml();
  const mathml_intent = intent_box?.parentElement?.style?.display == "block" && intent_box.checked 

  to.value = pm["to"+tofmt](mathml_intent);
  pre_render.innerHTML = mathml;
  pre_render.setAttribute("math-content", mathml);
  math_tree.value = pm.toDisplay(tofmt.toLowerCase());
  if (mathmlEngine() === "mathjax" && MathJax.hasOwnProperty("typeset")) { MathJax.typeset(); }
  return [from, pm]
}

function currentEngine() {
  return document.getElementById("mathmlEngine").selectedOptions[0].value
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function flashMessage(type = "error", timeout = 5000) {
  const message = document.querySelector(`#flash-messages > #${type}`);
  message.style.display = "block";
  setTimeout(() => {
    message.style.display = "none";
  }, timeout);
}

export { Initialize, insertMathJax, converter, inputTimeouts, capitalize, flashMessage }

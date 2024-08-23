import Plurimath from "./plurimath-js/dist/index.js";

function Initialize() {
  document.addEventListener("DOMContentLoaded", convert);
  document.querySelector("#mathmlEngine").addEventListener("change", changeEngine);
  document.querySelector("#from").addEventListener("input", inputTimeouts);
  document.querySelector("#tofmt").addEventListener("change", inputTimeouts);
}

function convert(){
  changeEngine()
  const from       = document.getElementById("from").value;
  const fromfmt    = document.getElementById("fromfmt").value;
  const pre_render = document.getElementById("preview");

  // empty result
  pre_render.innerText = "";

  if(from.trim() == "") return;
  converter(fromfmt)
}

function changeEngine() {
  const engine = document.getElementById("mathmlEngine");
  const selectedValue = engine.selectedOptions[0].value
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

function inputTimeouts(event) {
  if (event.timeout) { clearTimeout(event.timeout) };
  event.timeout = setTimeout(convert, 1000);
}

function converter(from_fmt) {
  const to = document.getElementById("to");
  const from = document.getElementById("from");
  const tofmt = document.getElementById("tofmt").value;
  const pre_render = document.getElementById("preview");
  const math_tree  = document.getElementById("math_tree");
  const selectedValue = document.getElementById("mathmlEngine").selectedOptions[0].value;
  const pm = new Plurimath(from.value, from_fmt);
  const mathml = pm.toMathml();

  to.value = pm["to"+tofmt]();
  pre_render.innerHTML = mathml;
  pre_render.setAttribute("math-content", mathml);
  math_tree.value = pm.toDisplay(tofmt.toLowerCase());
  if (selectedValue === "mathjax" && MathJax.hasOwnProperty("typeset")) { MathJax.typeset(); }
  return [from, pm]
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export { Initialize, converter, inputTimeouts, capitalize }

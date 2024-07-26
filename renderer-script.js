import Plurimath from "https://www.plurimath.org/plurimath-js/dist/index.js";

document.addEventListener("DOMContentLoaded", convert);
document.querySelector("#mathmlEngine").addEventListener("change", changeEngine);
document.querySelector("#from").addEventListener("input", inputTimeouts);
document.querySelector("#fromfmt").addEventListener("change", inputTimeouts);
document.querySelector("#tofmt").addEventListener("change", inputTimeouts);

function convert(){
  changeEngine()
  const from       = document.getElementById("from").value;
  const fromfmt    = document.getElementById("fromfmt").value;
  const tofmt      = document.getElementById("tofmt").value;
  const to         = document.getElementById("to");
  const pre_render = document.getElementById("preview");
  const math_tree  = document.getElementById("math_tree");
  const engine = document.getElementById("mathmlEngine");
  const selectedValue = engine.selectedOptions[0].value;

  // empty result
  to.value = "";
  pre_render.innerText = "";
  math_tree.value = "";

  if(from.trim() == "") return;

  const pm = new Plurimath(from, fromfmt);
  to.value = pm["to"+tofmt]();

  const mathml = pm["toMathml"]();
  pre_render.setAttribute("math-content", mathml);
  pre_render.innerHTML=mathml;
  math_tree.value=pm.toDisplay(tofmt.toLowerCase());
  if (selectedValue === "mathjax" && MathJax.hasOwnProperty("typeset")) { MathJax.typeset() }
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

function inputTimeouts() {
  if (this.timeout) { clearTimeout(this.timeout) };
  this.timeout = setTimeout(convert, 1000);
}

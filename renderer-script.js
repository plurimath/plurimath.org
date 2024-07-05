import Plurimath from "https://www.plurimath.org/plurimath-js/dist/index.js";

document.addEventListener("DOMContentLoaded", convert);
document.querySelector("#mathmlEngine").addEventListener("change", changeEngine);
document.querySelector("#from").addEventListener("input", convert);
document.querySelector("#fromfmt").addEventListener("change", convert);
document.querySelector("#tofmt").addEventListener("change", convert);

function convert(){
  insertMathJax()
  var from       = document.getElementById("from").value;
  var fromfmt    = document.getElementById("fromfmt").value;
  var tofmt      = document.getElementById("tofmt").value;
  var to         = document.getElementById("to");
  var pre_render = document.getElementById("preview");
  var math_tree  = document.getElementById("math_tree");

  // empty result
  to.value = "";
  pre_render.innerText = "";
  math_tree.value = "";

  if(from.trim() == "") return;

  var pm = new Plurimath(from, fromfmt);
  to.value = pm["to"+tofmt]();

  const mathml = pm["toMathml"]();
  pre_render.setAttribute("math-content", mathml);
  pre_render.innerHTML=mathml;
  math_tree.value=pm.toDisplay(tofmt.toLowerCase());
}

function changeEngine() {
  const engine = document.getElementById("mathmlEngine");
  const selectedValue = engine.selectedOptions[0].value
  if (selectedValue == "mathjax") { return insertMathJax() }

  const script = document.getElementById("MathJax-script");
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
  element.onload = () => { MathJax.typesetPromise() };
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

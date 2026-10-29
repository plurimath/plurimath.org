import Plurimath from "./plurimath.js";

function Initialize() {
  document.addEventListener("DOMContentLoaded", convert);
  document.querySelector("#mathmlEngine").addEventListener("change", changeEngine);
  document.querySelector("#from").addEventListener("input", inputTimeouts);
  document.querySelector("#tofmt").addEventListener("change", inputTimeouts);
}

function convert(){
  try {
    changeEngine();
    converter(document.getElementById("fromfmt").value);
  } catch (error) {
    console.error(error);
    flashMessage();
  }
}

function changeEngine() {
  renderPreview(currentEngine());
}

function renderPreview(engine) {
  const preview = document.getElementById("preview");
  preview.dataset.renderer = engine;
  window.MathJax?.typesetClear?.([preview]);
  preview.innerHTML = preview.getAttribute("math-content") || "";
  if (engine !== "mathjax") return;
  insertMathJax();
  if (window.MathJax?.typesetPromise) {
    MathJax.typesetPromise([preview]).catch(error => {
      console.error(error);
      flashMessage();
    });
  }
}

function insertMathJax() {
  if (document.getElementById("MathJax-script")) return;

  const element = document.createElement("script");
  element.id = "MathJax-script";
  element.type = "text/javascript";
  element.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
  element.async = true;
  window.MathJax = {
    startup: {
      typeset: false,
      ready: () => {
        MathJax.startup.defaultReady();
        MathJax.startup.promise.then(() => {
          const preview = document.getElementById("preview");
          if (preview.dataset.renderer === "mathjax") renderPreview("mathjax");
        });
      }
    }
  };
  document.head.appendChild(element);
}

function inputTimeouts(event, callableFunction = convert) {
  const input = event.currentTarget || event.target;
  clearTimeout(input.conversionTimeout);
  input.conversionTimeout = setTimeout(callableFunction, 1000);
}

function converter(from_fmt, mathmlEngine = currentEngine) {
  const to = document.getElementById("to");
  const from = document.getElementById("from");
  const tofmt = document.getElementById("tofmt").value;
  const pre_render = document.getElementById("preview");
  const math_tree  = document.getElementById("math_tree");
  const intent_box = document.getElementById("display-intent");
  const error = document.querySelector("#flash-messages > #error");
  if (error) error.style.display = "none";

  // empty result
  window.MathJax?.typesetClear?.([pre_render]);
  to.value = "";
  pre_render.innerText = "";
  pre_render.removeAttribute("math-content");
  math_tree.value = "";

  if(from.value.trim() == "") return;

  const pm = new Plurimath(from.value, from_fmt);
  const mathml = pm.toMathml();
  const mathml_intent = intent_box?.parentElement?.style?.display == "block" && intent_box.checked 

  const output = pm["to"+tofmt](mathml_intent);
  // HTML has no legacy text-tree formatter; show the preview's MathML tree.
  const tree = pm.toDisplay(tofmt === "Html" ? "mathml" : tofmt.toLowerCase());
  to.value = output;
  pre_render.setAttribute("math-content", mathml);
  math_tree.value = tree;
  renderPreview(mathmlEngine());
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
  if (!message) return;
  clearTimeout(message.messageTimeout);
  message.style.display = "block";
  message.messageTimeout = setTimeout(() => {
    message.style.display = "none";
  }, timeout);
}

export { Initialize, renderPreview, converter, inputTimeouts, capitalize, flashMessage }

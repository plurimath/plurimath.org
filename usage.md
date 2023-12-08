---
title: Getting Started
description: Here are examples how to use Plurimath JS library
layout: docs-base
---

### Web applications

```html
<script type="module">
  import Plurimath from "https://www.plurimath.org/plurimath-js/dist/index.js";

  const formula = new Plurimath('ubrace(1+2+3+4)_("4 terms")', "asciimath");
  console.log(formula.toLatex());
</script>
```

### Node.JS

```bash
$ npm install -S @plurimath/plurimath
```

ES Modules (recommended):

```javascript
import Plurimath from "@plurimath/plurimath"

const formula = new Plurimath('ubrace(1+2+3+4)_("4 terms")', "asciimath");
console.log(formula.toLatex());
```

CommonJS:

```javascript
const Plurimath = require("@plurimath/plurimath/index.cjs").default;

const formula = new Plurimath('ubrace(1+2+3+4)_("4 terms")', "asciimath");
console.log(formula.toLatex());
```

Published dapentry drawing - Readme
===================================

This package contains all you need to get started using your published drawing. There are the following files

* `drawing.mjs` - The JavaScript code for the drawing
* `dapentryLib.mjs` - A library containing functionality that is used to compute and render the drawing
* `index.html` - An example HTML-file that displays the drawing
* `example.mjs` - JavaScript code that is used by the index.html to display the drawing.
* `Readme.md` - This file

## Using the drawing-code

The file `drawing.mjs` exports a ES2015-class `Drawing` with the following methods:

* `init` - Initializes everything. You pass it the `id` of the SVG-element of your webpage 
* `update` - (Re)calculates the drawing. This method takes the arguments you specified when publishing as parameters
* `renderObjects` - Renders the object information calculated by the `update`-method 
* `renderDrawing` - Recalculates and renders everything in one call. It takes the same parameters as `update`.

The file `example.mjs` demonstrates all that is needed to render the drawing.

```javascript
import {Drawing} from "./drawing.mjs";

const d = new Drawing();
d.init("drawing");

const f1 = [10, 20, 30, 40, 50];
const f2 = 5;
d.renderDrawing(f1, f2);
```

If you do not pass some or all parameters to `update` or `renderDrawing`, the default values specified during
publishing are used.

You can, of course hook your parameters up to some inputs and update the drawing accordingly. For example
you could use range inputs to manipulate two numeric parameters of a drawing:

```javascript
import { drawing } from "./drawing.mjs";

const spokeSizeInput = document.getElementById("spokeSize");
const spokesInput = document.getElementById("spokes");

const d = new drawing();
d.init("drawing");

function update() {
    d.renderDrawing(Number(spokesInput.value), Number(spokeSizeInput.value));
}

spokesInput.oninput = () => {
    update();
};
spokeSizeInput.oninput = () => {
    update();
};
```

### Multiple instance

You can display multiple instances of the drawing on one page. For each instance create a `new Drawing()` and
initialize it with its own SVG element.

## Compatibility

The code is compatible with all modern browsers like Chrome, Firefox and Safari. Internet Explorer is not supported.
The old non-Chromium-based Microsoft Edge is not tested.

### ES2015-Modules

All JavaScript code is provided as JavaScript modules. All modern browsers understand these. It means, you can use
`export` and `import` directly with no need for a bundler or a module loader like requireJS.

You can of course take the code and run it through your preferred bundler like e.g. webpack, rollup or parcel.

See [the MDN page on JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) for more info.

## License

The rights to the generated code in `drawing.mjs` lie by the creator of the drawing.

The rights to the code in `dapentryLibrary.mjs` lies with its creator, Stephan Smola, except for 
code from [d3](https://d3js.org/) which it bundles. d3 is Copyright 2010-2022 by Mike Bostock.

THE SOFTWARE AND THE GENERATED CODE IS PROVIDED "AS IS" AND THE AUTHOR OF THE
SOFTWARE AND THE GENERATOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE 
INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL
THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES 
OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN 
AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN 
CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE OR THE GENERATED CODE.

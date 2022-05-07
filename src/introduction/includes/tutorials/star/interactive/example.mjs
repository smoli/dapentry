
import * as dapentry from "./dapentryLib.mjs";
import { Drawing } from "./drawing.mjs";
const d = new Drawing();
d.init("drawing");

let spokes = 7;
let spokeRatio = 0.65;
d.renderDrawing(spokes, spokeRatio);

const valueList = document.getElementById("demoValues");

function makeRange(label, min, max, step, value, oninput) {
    let inp = document.createElement("input");
    inp.type = "range";
    inp.min = "" + min;
    inp.max = "" + max;
    inp.step = "" + step;
    inp.value = "" + value;
    inp.oninput = () => {
        oninput(inp);
    }
    let li = document.createElement("li");
    li.appendChild(inp);
    valueList.appendChild(li);
}

makeRange("Spokes", 1, 500, 1, spokes, inp => {
    spokes = Number(inp.value);
    update();
});

makeRange("Spoke-Ratio", 0, 1, 0.01, spokeRatio, inp => {
    spokeRatio = Number(inp.value);
    update();
});

function update() {
    d.renderDrawing(spokes, spokeRatio);
}

update();

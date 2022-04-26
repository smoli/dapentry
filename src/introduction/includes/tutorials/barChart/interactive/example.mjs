import * as dapentry from "./dapentryLib.mjs";
import { Drawing } from "./drawing.mjs";

const d = new Drawing();
d.init("drawing");

const data = [17.00, 12.00, 3.00, 21.00, 32.00];
const valueList = document.getElementById("demoValues");

data.forEach((v, i) => {
    const inp = document.createElement("input");
    inp.type = "range";
    inp.max = "100";
    inp.min = "0";
    inp.value = "" + v;
    inp.oninput = () => {
        data[i] = inp.value;
        update();
    }

    const li = document.createElement("li");
    li.appendChild(inp);
    valueList.appendChild(li);
});

function update() {
    d.renderDrawing(data);
}

update();


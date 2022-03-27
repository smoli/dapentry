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

update();

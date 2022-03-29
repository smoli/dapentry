import {Drawing} from "./drawing.mjs";

const d = new Drawing();
d.init("drawing");

const f1 = [10, 20, 30, 40, 50];
const f2 = 5;
d.renderDrawing(f1, f2);

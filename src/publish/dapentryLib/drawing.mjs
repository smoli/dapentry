import * as dapentry from "./dist/dapentryLib.mjs";

// created with dapentry, https://www.dapentry.com
// this software uses d3, https://d3js.org: Copyright 2010-2022 Mike Bostock, License: https://github.com/d3/d3/blob/main/LICENSE

export function drawing() {
    const __objects = {};
    __objects.__canvas = dapentry.Canvas.create_1_1(1000);
    const $styles = {
        default: {
            "fillColor": "#FF7F50",
            "strokeColor": "#FF7F50",
            "fillOpacity": 0.2,
            "strokeWidth": 2,
        },
        textDefault: {
            "fillColor": "#FF7F50",
            "strokeColor": "#FF7F50",
            "fillOpacity": 1,
            "strokeWidth": 0,
            "textAlignment": 0,
            "verticalAlignment": 0,
            "fontFamily": "Sans-serif",
            "fontSize": 50,
        }
    };
    __objects.Circle1 = new dapentry.Circle("Circle1", 555.79, 228.72, 228.34);
    __objects.Circle1.style = $styles.default;
    return [__objects.Circle1];
}

const renderer = new dapentry.SVGRenderer();
renderer.init("drawing");
const drawingContainer = document.getElementById("drawing");
drawingContainer.setAttribute("viewBox", "0 0 1000 1000");
export function renderDrawing() {
    drawing().forEach(o => renderer.render(o, false));
}

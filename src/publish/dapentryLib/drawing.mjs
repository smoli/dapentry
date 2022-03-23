// created with dapentry, https://www.dapentry.com
// this software uses d3, https://d3js.org: Copyright 2010-2022 Mike Bostock, License: https://github.com/d3/d3/blob/main/LICENSE

import * as dapentry from "./dist/dapentryLib.mjs";

let __viewBoxHeight = 1000;
let __aspectRatio = "1_1";


const __renderer = new dapentry.SVGRenderer();
let __canvas = null;
let __viewBoxWidth = __viewBoxHeight;

export function init(svgElementID, aspectRatio = __aspectRatio, viewBoxHeight = __viewBoxHeight) {
    __renderer.init(svgElementID);

    __aspectRatio = aspectRatio;
    __viewBoxHeight = viewBoxHeight;

    switch (__aspectRatio) {

        case "3_2":
            __canvas = dapentry.Canvas.create_3_2(__viewBoxHeight);
            __viewBoxWidth = __viewBoxHeight / 2 * 3;
            break;

        case "4_3":
            __canvas = dapentry.Canvas.create_4_3(__viewBoxHeight);
            __viewBoxWidth = __viewBoxHeight / 3 * 4;
            break;

        case "16_10":
            __canvas = dapentry.Canvas.create_16_10(__viewBoxHeight);
            __viewBoxWidth = __viewBoxHeight / 10 * 16;
            break;

        case "16_9":
            __canvas = dapentry.Canvas.create_16_9(__viewBoxHeight);
            __viewBoxWidth = __viewBoxHeight / 9 * 16;
            break;

        default:
            __canvas = dapentry.Canvas.create_1_1(__viewBoxHeight);
            break;
    }

    const drawingContainer = document.getElementById("drawing");
    drawingContainer.setAttribute("viewBox", "0 0 " + __viewBoxWidth + " " + __viewBoxHeight);
}


export function renderDrawing(radius = 200) {
    renderObjects(drawing(radius))
}

export function renderObjects(objects) {
    objects.forEach(o => __renderer.render(o, false));
}

export function drawing(radius = 200) {
    const __objects = {};
    __objects.canvas = __canvas;
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
    __objects.Circle1 = new dapentry.Circle("Circle1", __objects.canvas.center.x, __objects.canvas.center.y, radius);
    __objects.Circle1.style = $styles.default;
    return [__objects.Circle1];
}

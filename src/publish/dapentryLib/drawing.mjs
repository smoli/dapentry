// created with dapentry, https://www.dapentry.com

import * as dapentry from "./dapentryLib.mjs";

let __viewBoxHeight = 1000;
let __aspectRatio = "ar1_1";

const $styles = dapentry.defaultStyles;
const __renderer = new dapentry.SVGRenderer();
let __canvas = null;
let __viewBoxWidth = __viewBoxHeight;

export function init(svgElementID, aspectRatio = __aspectRatio, viewBoxHeight = __viewBoxHeight) {
    __renderer.init(svgElementID);

    __aspectRatio = aspectRatio;
    __viewBoxHeight = viewBoxHeight;

    switch (__aspectRatio) {

        case "ar3_2":
            __canvas = dapentry.Canvas.create_3_2(__viewBoxHeight);
            __viewBoxWidth = __viewBoxHeight / 2 * 3;
            break;

        case "ar4_3":
            __canvas = dapentry.Canvas.create_4_3(__viewBoxHeight);
            __viewBoxWidth = __viewBoxHeight / 3 * 4;
            break;

        case "ar16_10":
            __canvas = dapentry.Canvas.create_16_10(__viewBoxHeight);
            __viewBoxWidth = __viewBoxHeight / 10 * 16;
            break;

        case "ar16_9":
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

function drawing() {
    const __objects = {};
    __objects.canvas = __canvas;
    __objects.Circle1 = new dapentry.Circle("Circle1", 555.79, 228.72, 228.34);
    __objects.Circle1.style = $styles.default;
    return [__objects.Circle1];
}


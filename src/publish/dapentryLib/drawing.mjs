// created with dapentry, https://www.dapentry.com
// this software uses d3, https://d3js.org:
//      Copyright 2010-2022 Mike Bostock
//      License: https://github.com/d3/d3/blob/main/LICENSE

import * as dapentry from "./dapentryLib.mjs";

let __viewBoxHeight = 1000;
let __aspectRatio = "ar1_1";

const __renderer = new dapentry.SVGRenderer();
let __canvas = null;
let __viewBoxWidth = __viewBoxHeight;

/**
 * Initialize the drawing.
 *
 * @param svgElementID      The id of the dom element to draw to. Must be an svg.
 * @param aspectRatio       The aspect ratio the drawing should be. Valid values are 'ar1_1', 'ar3_2', 'ar4_3', 'ar16_9', 'ar16_10'
 * @param viewBoxHeight     The height of the viewbox. Width will be calculated based on the aspect ratio.
 */
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


/**
 Renders a list of objects.
 */
export function renderObjects(objects) {
    objects.forEach(o => __renderer.render(o, false));
}

/**
 This recalculates and renders the drawing.
 */
export function renderDrawing(data = [10, 20, 30, 40, 50]) {
    renderObjects(drawing(data));
}

/**
 This only recalculates the drawing. The result
 is a list of objects that you can pass to

 renderObjects

 to redraw the drawing.
 */
export function drawing(data = [10, 20, 30, 40, 50]) {
    const width = 1 / dapentry.size(data);
    const ratio = 1 / dapentry.max(data);
    const __objects = dapentry.makeObjectManager();
    __objects("Rectangle3", dapentry.rectanglePointPoint("Rectangle3", __canvas.topLeft.x, __canvas.topLeft.y, __canvas.bottomRight.x, __canvas.bottomRight.y));
    __objects("Rectangle3").style = dapentry.$styles.default;
    dapentry.scaleObject(__objects("Rectangle3"), width, 1, __objects("Rectangle3").left.x, __objects("Rectangle3").left.y);
    data.forEach(data => {
        __objects("Rectangle4", dapentry.rectanglePointPoint("Rectangle4", __objects("Rectangle3").topLeft.x, __objects("Rectangle3").topLeft.y, __objects("Rectangle3").bottomRight.x, __objects("Rectangle3").bottomRight.y));
        __objects("Rectangle4").style = dapentry.$styles.default;
        dapentry.scaleObject(__objects("Rectangle4"), 1, (data * ratio), __objects("Rectangle4").bottom.x, __objects("Rectangle4").bottom.y);
        dapentry.moveObjectToPoint
        (__objects("Rectangle3"), 9, __objects("Rectangle3"), 10);
    });
    return [__objects("Rectangle4")];
}


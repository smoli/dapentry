export const jsPublishTemplate = `
// created with dapentry, https://www.dapentry.com
// this software uses d3, https://d3js.org: 
//      Copyright 2010-2022 Mike Bostock 
//      License: https://github.com/d3/d3/blob/main/LICENSE

import * as dapentry from "./dist/dapentryLib.mjs";

let __viewBoxHeight = <VIEWBOX_HEIGHT>;
let __aspectRatio = "<ASPECT_RATIO>";

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
    renderObjects(<DRAWING_FUNCTION_NAME>(radius))
}

export function renderObjects(objects) {
    objects.forEach(o => __renderer.render(o, false));
}

<DRAWING_FUNCTION>
`;
// created with dapentry, https://www.dapentry.com
// this software uses d3, https://d3js.org:
//      Copyright 2010-2022 Mike Bostock
//      License: https://github.com/d3/d3/blob/main/LICENSE

import * as dapentry from "./dapentryLib.mjs";

let __viewBoxHeight = 1000;
let __aspectRatio = "ar1_1";

export class drawing {

    constructor() {
        this.__renderer = new dapentry.SVGRenderer();
        this.__canvas = null;
        this.__viewBoxWidth = __viewBoxHeight;
    }

    /**
     * Initialize the drawing.
     *
     * @param svgElementID      The id of the dom element to draw to. Must be an svg.
     * @param aspectRatio       The aspect ratio the drawing should be. Valid values are 'ar1_1', 'ar3_2', 'ar4_3', 'ar16_9', 'ar16_10'
     * @param viewBoxHeight     The height of the viewbox. Width will be calculated based on the aspect ratio.
     */
    init(svgElementID, aspectRatio = __aspectRatio, viewBoxHeight = __viewBoxHeight) {
        this.__renderer.init(svgElementID);

        this.__aspectRatio = aspectRatio;
        this.__viewBoxHeight = viewBoxHeight;

        switch (this.__aspectRatio) {

            case "ar3_2":
                this.__canvas = dapentry.Canvas.create_3_2(__viewBoxHeight);
                this.__viewBoxWidth = this.__viewBoxHeight / 2 * 3;
                break;

            case "ar4_3":
                this.__canvas = dapentry.Canvas.create_4_3(this.__viewBoxHeight);
                this.__viewBoxWidth = this.__viewBoxHeight / 3 * 4;
                break;

            case "ar16_10":
                this.__canvas = dapentry.Canvas.create_16_10(this.__viewBoxHeight);
                this.__viewBoxWidth = this.__viewBoxHeight / 10 * 16;
                break;

            case "ar16_9":
                this.__canvas = dapentry.Canvas.create_16_9(this.__viewBoxHeight);
                this.__viewBoxWidth = this.__viewBoxHeight / 9 * 16;
                break;

            default:
                this.__canvas = dapentry.Canvas.create_1_1(this.__viewBoxHeight);
                break;
        }

        const drawingContainer = document.getElementById("drawing");
        drawingContainer.setAttribute("viewBox", "0 0 " + this.__viewBoxWidth + " " + this.__viewBoxHeight);
    }


    /**
     Renders a list of objects.
     */
    renderObjects(objects) {
        objects.forEach(o => this.__renderer.render(o, false));
    }

    /**
     This recalculates and renders the drawing.
     */
    renderDrawing(data = [10, 20, 30, 40, 50]) {
        this.__renderer.clear("Objects");
        this.renderObjects(this.drawing(data));
    }

    /**
     This only recalculates the drawing. The result
     is a list of objects that you can pass to

     renderObjects

     to redraw the drawing.
     */
    drawing(data = [10, 20, 30, 40, 50]) {
        const width = 1 / dapentry.size(data);
        const ratio = 1 / dapentry.max(data);
        const __objects = dapentry.makeObjectManager();
        __objects("Rectangle3", dapentry.rectanglePointPoint("Rectangle3", this.__canvas.topLeft.x, this.__canvas.topLeft.y, this.__canvas.bottomRight.x, this.__canvas.bottomRight.y));
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

}

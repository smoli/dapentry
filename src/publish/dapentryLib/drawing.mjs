
// created with dapentry, https://www.dapentry.com
// this software uses d3, https://d3js.org:
//      Copyright 2010-2022 Mike Bostock
//      License: https://github.com/d3/d3/blob/main/LICENSE

import * as dapentry from "./dapentryLib.mjs";

let __viewBoxHeight = 1000;
let __aspectRatio = "ar4_3";

export class Drawing {

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
    renderDrawing(f1 = [10, 20, 30, 40], f2 = 5) {
        this.__renderer.clear("Objects");
        this.renderObjects(this.update(f1,
            f2));
    }

    /**
     This only recalculates the drawing. The result
     is a list of objects that you can pass to

     renderObjects

     to redraw the drawing.
     */
    update(f1 = [10, 20, 30, 40], f2 = 5) {
        const __objects = dapentry.makeObjectManager();
        __objects("Circle1", dapentry.circleCenterPoint("Circle1", this.__canvas.center.x, this.__canvas.center.y, this.__canvas.top.x, this.__canvas.top.y));
        __objects("Circle1").style = dapentry.$styles.default;
        return [__objects("Circle1")];
    }

}

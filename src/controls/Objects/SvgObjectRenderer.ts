import {GRCircle, GrObject, GRRectangle, ObjectType} from "./GrObject";
import {ObjectClickCallback, ObjectRenderer} from "./ObjectRenderer";


/**
 * Renderer using SVG. This uses d3 (3.4) for rendering.
 */
export class SvgObjectRenderer extends ObjectRenderer {

    protected _layer;

    constructor(layer, onObjectClick:ObjectClickCallback = null) {
        super(onObjectClick);
        this._layer = layer;
    }


    clear() {
        this._layer.select("*").remove();
    }

    render(object: GrObject, selected: boolean) {

        let svgObjc;

        switch (object.type) {
            case ObjectType.Circle:
                svgObjc = this.renderCircle(object as GRCircle);
                break;

            case ObjectType.Rectangle:
                svgObjc = this.renderRectangle(object as GRRectangle);
                break;

            case ObjectType.Ellipse:
                break;
            case ObjectType.Square:
                break;
            case ObjectType.Line:
                break;
        }

        if (selected) {
            svgObjc.attr("style", "stroke: green !important")
        } else {
            svgObjc.attr("style", "")
        }
    }

    protected getObjectOrCreate(object: GrObject, svgTag: string): any {
        let svgObject = this._layer.select("#" + object.id);

        if (svgObject.empty()) {
            svgObject = this._layer.append(svgTag).attr("id", object.id);
            svgObject.on("click", () => {
                this._fireSelect(object);
            });
        }

        return svgObject;
    }

    renderCircle(circle: GRCircle) {
        const c = this.getObjectOrCreate(circle, "circle");

        c.attr("cx", circle.x);
        c.attr("cy", circle.y);
        c.attr("r", circle.r);

        return c;
    }

    renderRectangle(rectangle: GRRectangle) {
        const r = this.getObjectOrCreate(rectangle, "rect");

        r.attr("x", rectangle.x - rectangle.w / 2);
        r.attr("y", rectangle.y - rectangle.h / 2);
        r.attr("width", rectangle.w);
        r.attr("height", rectangle.h);

        return r;
    }

}
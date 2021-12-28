import {GRCircle, GrObject, GRRectangle, ObjectType} from "./GrObject";
import {ObjectRenderer} from "./ObjectRenderer";


/**
 * Renderer using SVG. This uses d3 (3.4) for rendering.
 */
export class SvgObjectRenderer extends ObjectRenderer {

    protected _layer;

    constructor(layer) {
        super();
        this._layer = layer;
    }


    clear() {
        this._layer.select("*").remove();
    }

    render(object: GrObject) {
        switch (object.type) {
            case ObjectType.Circle:
                this.renderCircle(object as GRCircle);
                break;

            case ObjectType.Rectangle:
                this.renderRectangle(object as GRRectangle);
                break;

            case ObjectType.Ellipse:
                break;
            case ObjectType.Square:
                break;
            case ObjectType.Line:
                break;

        }
    }

    protected getObjectOrCreate(object: GrObject, svgTag: string): any {
        let svgObject = this._layer.select("#" + object.id);

        if (svgObject.empty()) {
            svgObject = this._layer.append(svgTag).attr("id", object.id)
        }

        return svgObject;
    }

    renderCircle(circle: GRCircle) {
        const c = this.getObjectOrCreate(circle, "circle");

        c.attr("cx", circle.x);
        c.attr("cy", circle.y);
        c.attr("r", circle.r);
    }

    renderRectangle(rectangle: GRRectangle) {
        const r = this.getObjectOrCreate(rectangle, "rect");

        r.attr("x", rectangle.x - rectangle.w / 2);
        r.attr("y", rectangle.y - rectangle.h / 2);
        r.attr("width", rectangle.w);
        r.attr("height", rectangle.h);
    }

}
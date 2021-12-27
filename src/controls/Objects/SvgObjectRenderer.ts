import {GRCircle, GrObject, ObjectType} from "./GrObject";
import {ObjectRenderer} from "./ObjectRenderer";

export class SvgObjectRenderer extends ObjectRenderer {

    protected _layer;

    constructor(layer) {
        super();
        this._layer = layer;
    }


    render(object: GrObject) {
        switch (object.type) {
            case ObjectType.Circle:
                this.renderCircle(object as GRCircle);
                break;
            case ObjectType.Rectangle:
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

}
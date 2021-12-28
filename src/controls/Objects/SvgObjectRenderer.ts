import {BoundingBox, GRCircle, GrObject, GRRectangle, ObjectType} from "./GrObject";
import {ObjectClickCallback, ObjectRenderer} from "./ObjectRenderer";
import {Selection} from "d3";

enum ToolClasses {
    object = "grObject",
    handle = "transformationHandle",
    boundingBox = "boundingBox"
}

enum ToolClassSelectors {
    object = ".grObject",
    handle = ".transformationHandle",
    boundingBox = ".boundingBox"
}


/**
 * Renderer using SVG. This uses d3 (3.4) for rendering.
 */
export class SvgObjectRenderer extends ObjectRenderer {

    protected _layer:Selection<any>;

    constructor(layer:Selection<any>, onObjectClick:ObjectClickCallback = null) {
        super(onObjectClick);
        this._layer = layer;
    }


    clear() {
        this._layer.selectAll("*").remove();
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
            this.renderBoundingBox(object)
        } else {
            this.removeBoundingBox(object);
        }
    }

    /**
     * Get svg entity for object from the layer. If it does not exist yet,
     * create it using the `svgTag`.
     *
     * Every object will be wrapped in a group. The group will be returned.
     * In order to access the object you can use the class `ToolClassSelectors.object` via a selection.
     *
     * ```
     *      const g = this.getObjectOrCreate(someObject, "sometag");
     *      const svgObjectRepresentation = g.select(ToolClassSelectors.object);
     * ```
     *
     * @param object
     * @param svgTag
     * @protected
     */
    protected getObjectOrCreate(object: GrObject, svgTag: string): Selection<any> {
        let svgGroup = this._layer.select("#" + object.id);

        if (svgGroup.empty()) {
            svgGroup = this._layer.append("g").attr("id", object.id);

            const svgObject = svgGroup.append(svgTag).attr("class", ToolClasses.object);

            svgObject.on("click", () => {
                this._fireSelect(object);
            });
        }

        return svgGroup;
    }

    /**
     * Get object from layer. This returns the group.
     *
     * @see getObjectOrCreate
     * @param object
     * @protected
     */
    protected getObject(object:GrObject): Selection<any> {
        let svgGroup = this._layer.select("#" + object.id);
        if (svgGroup.empty()) {
            return null;
        }

        return svgGroup;
    }

    renderCircle(circle: GRCircle) {
        const c = this.getObjectOrCreate(circle, "circle").select(ToolClassSelectors.object);

        c.attr("cx", circle.x);
        c.attr("cy", circle.y);
        c.attr("r", circle.r);

        return c;
    }

    renderRectangle(rectangle: GRRectangle) {
        const r = this.getObjectOrCreate(rectangle, "rect").select(ToolClassSelectors.object);

        r.attr("x", rectangle.x - rectangle.w / 2);
        r.attr("y", rectangle.y - rectangle.h / 2);
        r.attr("width", rectangle.w);
        r.attr("height", rectangle.h);

        return r;
    }


    renderBoundingBox(object:GrObject) {
        const g = this.getObject(object);
        if (g) {
            g.selectAll(ToolClassSelectors.boundingBox).remove();

            const bb = object.boundingBox;

            g.append("rect")
                .attr("x", bb.x - bb.w / 2)
                .attr("y", bb.y - bb.h / 2)
                .attr("width", bb.w)
                .attr("height", bb.h)
                .attr("class", ToolClasses.boundingBox);
        }
    }

    public removeBoundingBox(object: GrObject) {
        const g = this.getObject(object);
        if (g) {
            g.selectAll(ToolClassSelectors.boundingBox).remove();
        }
    }
}
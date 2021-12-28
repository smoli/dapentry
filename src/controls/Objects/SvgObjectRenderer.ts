// @ts-ignore
import d3 from "sap/ui/thirdparty/d3";
import {GRCircle, GrObject, GRRectangle, ObjectType} from "./GrObject";
import {HandleMouseCallBack, ObjectClickCallback, ObjectRenderer, RenderLayer} from "./ObjectRenderer";
import {Selection} from "d3";
import {InteractionEventData, InteractionEvents} from "../InteractionEvents";

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

    protected _objectLayer:Selection<any>;
    protected _interactionLayer:Selection<any>;

    constructor(container: Selection<any>, onObjectClick:ObjectClickCallback = null) {
        super(onObjectClick);
        this._setupLayers(container);
    }

    protected _setupLayers(container: Selection<any>):void {
        this._objectLayer = container.append("g");
        this._interactionLayer = container.append("g");
    }


    clear(layer:RenderLayer) {
        if (layer === RenderLayer.Objects) {
            this._objectLayer.selectAll("*").remove();
        } else if (layer === RenderLayer.Interaction) {
            this._interactionLayer.selectAll("*").remove();
        }
    }

    render(object: GrObject, selected: boolean) {

        let svgObjc;

        switch (object.type) {
            case ObjectType.Circle:
                svgObjc = this._renderCircle(this._objectLayer, object as GRCircle);
                break;

            case ObjectType.Rectangle:
                svgObjc = this._renderRectangle(this._objectLayer, object as GRRectangle);
                break;

            case ObjectType.Ellipse:
                break;
            case ObjectType.Square:
                break;
            case ObjectType.Line:
                break;
        }

        if (selected) {
            this.renderBoundingRepresentation(object)
        } else {
            this.removeBoundingRepresentation(object);
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
     * @param layer
     * @param object
     * @param svgTag
     * @protected
     */
    protected getObjectOrCreate(layer:Selection<any>, object: GrObject, svgTag: string): Selection<any> {
        let svgGroup = layer.select("#" + object.id);

        if (svgGroup.empty()) {
            svgGroup = layer.append("g").attr("id", object.id);

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
     * @param layer
     * @param object
     * @protected
     */
    protected getObject(layer:Selection<any>, object:GrObject): Selection<any> {
        let svgGroup = layer.select("#" + object.id);
        if (svgGroup.empty()) {
            return null;
        }

        return svgGroup;
    }

    protected getLayer(layer:RenderLayer):Selection<any> {
        if (layer === RenderLayer.Objects) {
            return this._objectLayer;
        } else if (layer === RenderLayer.Interaction) {
            return this._interactionLayer;
        }
    }

    protected _renderCircle(layer:Selection<any>, circle: GRCircle) {
        const c = this.getObjectOrCreate(layer, circle, "circle").select(ToolClassSelectors.object);

        c.attr("cx", circle.x);
        c.attr("cy", circle.y);
        c.attr("r", circle.r);

        return c;
    }
    renderCircle(layer:RenderLayer, circle: GRCircle) {
        return this._renderCircle(this.getLayer(layer), circle);
    }

    protected _renderRectangle(layer:Selection<any>, rectangle: GRRectangle) {
        const r = this.getObjectOrCreate(layer, rectangle, "rect").select(ToolClassSelectors.object);

        r.attr("x", rectangle.x - rectangle.w / 2);
        r.attr("y", rectangle.y - rectangle.h / 2);
        r.attr("width", rectangle.w);
        r.attr("height", rectangle.h);

        return r;
    }
    renderRectangle(layer:RenderLayer, rectangle: GRRectangle) {
        return this._renderRectangle(this.getLayer(layer), rectangle);
    }


    renderBoundingRepresentation(object:GrObject) {
        const g = this.getObject(this._objectLayer, object);
        if (g) {
            g.selectAll(ToolClassSelectors.boundingBox).remove();

            const bb = object.boundingBox;

            g.append("rect")
                .attr("x", bb.x - bb.w / 2)
                .attr("y", bb.y - bb.h / 2)
                .attr("width", bb.w)
                .attr("height", bb.h)
                .classed(ToolClasses.boundingBox, true);
        }
    }

    public removeBoundingRepresentation(object: GrObject) {
        const g = this.getObject(this._objectLayer, object);
        if (g) {
            g.selectAll(ToolClassSelectors.boundingBox).remove();
        }
    }

    public renderHandle(object: GrObject, x:number, y: number, onMouseEvent:HandleMouseCallBack, data?:any) {
        const g = this.getObject(this._objectLayer, object);
        if (g) {
            const px = object.x + x;
            const py = object.y + y;

            const handle = g.append("circle")
                .attr("cx", px)
                .attr("cy", py)
                .attr("r", "10px")
                .classed(ToolClasses.handle, true);

            this._attachHandleMouseEvents(object, handle, onMouseEvent, data);
        }
    }

    public removeAllHandles(object):void {
        const g = this.getObject(this._objectLayer, object);
        if (g) {
            g.selectAll(ToolClassSelectors.handle).remove();
        }
    }

    private _attachHandleMouseEvents(object:GrObject, svgObject:Selection<any>, handler:HandleMouseCallBack, data:any = null):void {

        function makeEvent(interactionEvent) {
            const d3Ev = d3.event;
            const d3MEv = d3.mouse(svgObject);
            const ed: InteractionEventData = {
                interactionEvent,
                x: d3MEv[0],
                y: d3MEv[1],
                dx: d3Ev.movementX,
                dy: d3Ev.movementY,
                alt: d3Ev.altKey, button: d3Ev.button, buttons: d3Ev.buttons, ctrl: d3Ev.ctrlKey, shift: d3Ev.shiftKey,
                key: d3Ev.key, keyCode: d3Ev.keyCode
            };

            return ed;
        }

        svgObject.on("mousedown", () => {
            handler(object, makeEvent(InteractionEvents.MouseDown), data)
        });
        svgObject.on("mouseup", () => {
            handler(object, makeEvent(InteractionEvents.MouseUp), data)
        })
        svgObject.on("click", () => {
            handler(object, makeEvent(InteractionEvents.Click), data)
        });
    }
}
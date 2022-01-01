// @ts-ignore
import d3 from "sap/ui/thirdparty/d3";
import {GrObject, ObjectType, Point2D} from "./GrObject";
import {HandleMouseCallBack, ObjectClickCallback, ObjectRenderer, POICallback, RenderLayer} from "./ObjectRenderer";
import {Selection} from "d3";
import {InteractionEventData, InteractionEvents} from "../InteractionEvents";
import {GrCircle} from "./GrCircle";
import {GrRectangle} from "./GrRectangle";
import {GrLine} from "./GrLine";

enum ToolClasses {
    object = "grObject",
    handle = "transformationHandle",
    poi = "pointOfInterest",
    boundingBox = "boundingBox"
}

enum ToolClassSelectors {
    object = ".grObject",
    handle = ".transformationHandle",
    poi = ".pointOfInterest",
    boundingBox = ".boundingBox"
}

const HANDLE_RADIUS: string = "7px";


/**
 * Renderer using SVG. This uses d3 (3.4) for rendering.
 */
export class SvgObjectRenderer extends ObjectRenderer {

    protected _renderedObjects: Array<GrObject>;
    protected _objectLayer: Selection<any>;
    protected _infoLayer: Selection<any>;
    protected _interactionLayer: Selection<any>;
    private _poiRenderingEnabled: boolean;

    constructor(container: Selection<any>, onObjectClick: ObjectClickCallback = null) {
        super(onObjectClick);
        this._setupLayers(container);
    }

    protected _setupLayers(container: Selection<any>): void {
        this._objectLayer = container.append("g");
        this._infoLayer = container.append("g");
        this._interactionLayer = container.append("g");
    }


    reset() {
        this._renderedObjects = [];
    }

    clear(layer: RenderLayer) {
        if (layer === RenderLayer.Objects) {
            this._objectLayer.selectAll("*").remove();
        } else if (layer === RenderLayer.Interaction) {
            this._interactionLayer.selectAll("*").remove();
        }
    }

    render(object: GrObject, selected: boolean) {

        let svgObjc;
        this._renderedObjects.push(object);

        switch (object.type) {
            case ObjectType.Circle:
                svgObjc = this._renderCircle(this._objectLayer, object as GrCircle);
                break;

            case ObjectType.Rectangle:
                svgObjc = this._renderRectangle(this._objectLayer, object as GrRectangle);
                break;

            case ObjectType.Ellipse:
                break;
            case ObjectType.Square:
                break;
            case ObjectType.Line:
                svgObjc = this._renderLine(this._objectLayer, object as GrLine);
                break;
        }

        if (selected) {
            this.renderBoundingRepresentation(object)
        } else {
            this.removeBoundingRepresentation(object);
        }

    }


    enablePOI(enabled: boolean,  poiCallback: POICallback, except: Array<GrObject>) {
        if (this._poiRenderingEnabled) {
            this._infoLayer.selectAll("*").remove();
        }

        if (enabled) {
            this._renderedObjects.forEach(o => {
                if (except.indexOf(o) === -1) {
                    this.renderPOI(o, poiCallback)
                }
            });
        }
        this._poiRenderingEnabled = enabled;
    }

    protected renderPOI(object: GrObject, poiCallback: POICallback) {
        this._objectLayer.selectAll("*").classed("noPointerEvents", false);

        let svgGroup = this._infoLayer.select("#" + object.id + "-info");
        if (!svgGroup.empty()) {
            svgGroup.selectAll("*").remove();
        } else {
            svgGroup = this._infoLayer.append("g").attr("id", object.id + "-info")
        }

        svgGroup.attr("transform", this._createTransform(object))

        const poiIds = Object.keys(object.pointsOfInterest);
        Object.values(object.pointsOfInterest)
            .forEach((poi, i) => {
                const c = svgGroup.append("circle")
                    .attr("cx", poi.x - object.x)
                    .attr("cy", poi.y - object.y)
                    .attr("r", HANDLE_RADIUS)
                    .classed(ToolClasses.poi, true);

                if (poiCallback) {
                    c.on("mouseenter", () => {
                        poiCallback(object, poiIds[i], true)
                    })
                    c.on("mouseleave", () => {
                        poiCallback(object, poiIds[i], false)
                    })
                }
            })

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
    protected getObjectOrCreate(layer: Selection<any>, object: GrObject, svgTag: string): Selection<any> {
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
    protected getObject(layer: Selection<any>, object: GrObject): Selection<any> {
        let svgGroup = layer.select("#" + object.id);
        if (svgGroup.empty()) {
            return null;
        }

        return svgGroup;
    }

    protected getLayer(layer: RenderLayer): Selection<any> {
        if (layer === RenderLayer.Objects) {
            return this._objectLayer;
        } else if (layer === RenderLayer.Interaction) {
            return this._interactionLayer;
        }
    }

    /**
     * Render circle on layer
     * @param layer
     * @param circle
     * @protected
     */
    protected _renderCircle(layer: Selection<any>, circle: GrCircle) {
        const o = this.getObjectOrCreate(layer, circle, "circle")
        const c = o.select(ToolClassSelectors.object);

        c.attr("cx", 0);
        c.attr("cy", 0);
        c.attr("r", circle.radius);

        this._createStyle(c, circle);

        o.attr("transform", this._createTransform(circle));

        return c;
    }

    renderCircle(layer: RenderLayer, circle: GrCircle) {
        return this._renderCircle(this.getLayer(layer), circle);
    }

    /**
     * Render rectangle on layer
     * @param layer
     * @param rectangle
     * @protected
     */
    protected _renderRectangle(layer: Selection<any>, rectangle: GrRectangle) {
        const o = this.getObjectOrCreate(layer, rectangle, "rect");

        const r = o.select(ToolClassSelectors.object);
        r.attr("x", -rectangle.width / 2);
        r.attr("y", -rectangle.height / 2);
        r.attr("width", rectangle.width);
        r.attr("height", rectangle.height);
        this._createStyle(r, rectangle);

        o.attr("transform", this._createTransform(rectangle));

        return r;
    }

    renderRectangle(layer: RenderLayer, rectangle: GrRectangle) {
        return this._renderRectangle(this.getLayer(layer), rectangle);
    }


    private _renderLine(layer: d3.Selection<any>, line: GrLine) {
        const o = this.getObjectOrCreate(layer, line, "line");

        console.log(line.x1 + line.x, line.y1 + line.y, line.x2 + line.x, line.y2 + line.y);
        const l = o.select(ToolClassSelectors.object);
        l.attr("x1", line.x1);
        l.attr("y1", line.y1);
        l.attr("x2", line.x2);
        l.attr("y2", line.y2);
        this._createStyle(l, line);

        o.attr("transform", this._createTransform(line));

        return l;
    }

    renderLine(layer: RenderLayer, line: GrLine) {
        return this._renderLine(this.getLayer(layer), line);
    }

    protected _createTransform(object: GrObject): string {
        // rotate -> translate -> scale

        let rot = "";

        let trans = `translate(${object.x} ${object.y})`
        if (object.rotation !== 0) {
            rot = `rotate(${object.rotation})`
        }

        return trans + " " + rot;
    }

    protected _createStyle(elem: Selection<any>, object: GrObject): void {
        if (!object.style) {
            return
        }
        elem.attr("style", `fill: ${object.style.fillColor}; fill-opacity: ${object.style.fillOpacity}; stroke: ${object.style.strokeColor}; stroke-width: ${object.style.strokeWidth}`);
    }

    renderBoundingRepresentation(object: GrObject) {
        const g = this.getObject(this._objectLayer, object);
        if (g) {
            const c = g.selectAll(ToolClassSelectors.boundingBox);

            if (!c.empty()) {
                // Already drawing a bounding representation
                return;
            }

            const bb = object.boundingBox;

            g.append("rect")
                .attr("x", -bb.w / 2)
                .attr("y", -bb.h / 2)
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

    public renderHandle(object: GrObject, p: Point2D, onMouseEvent: HandleMouseCallBack, data?: any) {
        const g = this.getObject(this._objectLayer, object);
        if (g) {
            console.log(p, data)
            const handle = g.append("circle")
                .attr("cx", p.x - object.x)
                .attr("cy", p.y - object.y)
                .attr("r", HANDLE_RADIUS)
                .classed(ToolClasses.handle, true);

            this._attachHandleMouseEvents(object, handle, onMouseEvent, data);
        }
    }

    public removeAllHandles(object): void {
        const g = this.getObject(this._objectLayer, object);
        if (g) {
            g.selectAll(ToolClassSelectors.handle).remove();
        }
    }

    private _attachHandleMouseEvents(object: GrObject, svgObject: Selection<any>, handler: HandleMouseCallBack, data: any = null): void {

        function makeEvent(interactionEvent) {
            const d3Ev = d3.event;
            const d3MEv = d3.mouse(svgObject.node());
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
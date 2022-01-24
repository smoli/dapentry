// @ts-ignore
import d3 from "sap/ui/thirdparty/d3";
import {GrObject, ObjectType, POIPurpose} from "../../../Geo/GrObject";
import {
    HandleMouseCallBack,
    InfoHandle,
    ObjectClickCallback,
    ObjectRenderer,
    POICallback,
    RenderLayer
} from "./ObjectRenderer";
import {Selection} from "d3";
import {InteractionEventData, InteractionEvents} from "../InteractionEvents";
import {GrCircle} from "../../../Geo/GrCircle";
import {GrRectangle} from "../../../Geo/GrRectangle";
import {GrLine} from "../../../Geo/GrLine";
import {GrBezier, GrPolygon, GrPolygonBase, GrQuadratic} from "../../../Geo/GrPolygon";
import {Point2D} from "../../../Geo/Point2D";
import {GrCompositeObject} from "../../../Geo/GrCompositeObject";
import {GrObjectList} from "../../../Geo/GrObjectList";

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

interface ObjectInfo {
    x: number,
    y: number,
    handles: Array<Point2D>
}

let infoHandle = 0;


function p2d(p: Point2D, operation: string = "L") {
    return `${operation} ${p.x} ${p.y}`;
}

/**
 * Renderer using SVG. This uses d3 (3.4) for rendering.
 */
export class SvgObjectRenderer extends ObjectRenderer {

    protected _renderedObjects: Array<GrObject> = [];
    protected _objectLayer: Selection<any>;
    protected _snappingLayer: Selection<any>;
    protected _interactionLayer: Selection<any>;
    protected _infoLayer: Selection<any>;
    private _poiRenderingEnabled: boolean;
    private _objectInfo: { [key: string]: ObjectInfo };

    constructor(container: Selection<any>, onObjectClick: ObjectClickCallback = null) {
        super(onObjectClick);
        this._setupLayers(container);
        this._objectInfo = {}
    }

    protected _setupLayers(container: Selection<any>): void {
        this._objectLayer = container.append("g");
        this._interactionLayer = container.append("g");
        this._snappingLayer = container.append("g");
        this._infoLayer = container.append("g").style("pointer-events", "none");
    }


    reset() {
        this._renderedObjects = [];
        this.clear(RenderLayer.Objects);
        this.clear(RenderLayer.Interaction);
    }

    clear(layer: RenderLayer) {
        if (layer === RenderLayer.Objects) {
            this._objectLayer.selectAll("*").remove();
            this._objectInfo = {};
        } else if (layer === RenderLayer.Interaction) {
            this._interactionLayer.selectAll("*").remove();
        }
    }

    remove(object: GrObject) {
        this._objectLayer.select("#" + object.id).remove();
    }

    render(object: GrObject, selected: boolean) {
        this._renderedObjects.push(object);
        return this._render(object, selected);
    }

    _render(object: GrObject, selected: boolean, parent: Selection<any> = null, enableMouseEvents: boolean = true) {


        switch (object.type) {
            case ObjectType.Circle:
                this._renderCircle(this._objectLayer, object as GrCircle, parent, enableMouseEvents);
                break;

            case ObjectType.Rectangle:
                this._renderRectangle(this._objectLayer, object as GrRectangle, parent, enableMouseEvents);
                break;

            case ObjectType.Ellipse:
                break;
            case ObjectType.Square:
                break;

            case ObjectType.Line:
                this._renderLine(this._objectLayer, object as GrLine, parent, enableMouseEvents);
                break;

            case ObjectType.Polygon:
                this._renderPolygon(this._objectLayer, object as GrPolygon, parent, enableMouseEvents);
                break;

            case ObjectType.Quadratic:
                this._renderQuadratic(this._objectLayer, object as GrQuadratic, parent, enableMouseEvents);
                break;

            case ObjectType.Bezier:
                this._renderBezier(this._objectLayer, object as GrBezier, parent, enableMouseEvents);
                break;

            case ObjectType.Composite:
                this._renderComposite(this._objectLayer, object as GrCompositeObject, parent, enableMouseEvents);

            case ObjectType.List:
                this._renderList(this._objectLayer, object as GrObjectList, parent, enableMouseEvents);

        }

        if (selected && object.type !== ObjectType.List) {
            this.renderBoundingRepresentation(object)
        } else {
            this.removeBoundingRepresentation(object);
        }
    }

    enablePOI(enabled: boolean, poiCallback: POICallback, except: Array<GrObject>) {
        if (this._poiRenderingEnabled) {
            this._snappingLayer.selectAll("*").remove();
        }

        if (enabled) {
            this._renderedObjects.forEach(o => {
                if (!except.find(e => e.uniqueName === o.uniqueName)) {
                    this.renderPOI(o, poiCallback)
                }
            });
        }
        this._poiRenderingEnabled = enabled;
    }

    protected renderPOI(object: GrObject, poiCallback: POICallback) {
        this._objectLayer.selectAll("*").classed("noPointerEvents", false);

        let svgGroup = this._snappingLayer.select("#" + object.id + "-info");
        if (!svgGroup.empty()) {
            svgGroup.selectAll("*").remove();
        } else {
            svgGroup = this._snappingLayer.append("g").attr("id", object.id + "-info")
        }

        const poiIds = Object.keys(object.pointsOfInterest(POIPurpose.SNAPPING));
        Object.values(object.pointsOfInterest(POIPurpose.SNAPPING))
            .forEach((poi, i) => {
                const c = svgGroup.append("circle")
                    .attr("cx", poi.x)
                    .attr("cy", poi.y)
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
    protected getObjectOrCreate(layer: Selection<any>, object: GrObject, svgTag: string, parent: Selection<any>, enableMouseEvents: boolean = true): Selection<any> {
        let svgGroup;
        let targetLayer = parent || layer;

        svgGroup = targetLayer.select("#" + object.id);

        if (svgGroup.empty()) {
            svgGroup = targetLayer.append("g").attr("id", object.id);

            const info = {
                x: object.x,
                y: object.y,
                handles: []
            }

            this._objectInfo[object.uniqueName] = info;

            const svgObject = svgGroup.append(svgTag).attr("class", ToolClasses.object);
            if (enableMouseEvents) {
                svgObject.on("click", () => {
                    this._fireSelect(object);
                });
            }

            // Slots to better control that handles are always painted on top of objects
            svgGroup.append("g").classed(ToolClasses.boundingBox, true);
            svgGroup.append("g").classed(ToolClasses.handle, true);
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


    private _renderComposite(layer: Selection<any>, comp: GrCompositeObject, parent: Selection<any>, enableMouseEvents: boolean) {
        const g = this.getObjectOrCreate(layer, comp, "g", parent, enableMouseEvents);

        if (g) {
            comp.objects.forEach(child => {
                this._render(child, false, g.select(ToolClassSelectors.object), false);
            })
        }
    }

    private _renderList(layer: Selection<any>, list: GrObjectList, parent: Selection<any>, enableMouseEvents: boolean) {
        const g = this.getObjectOrCreate(layer, list, "g", parent, enableMouseEvents);

        if (g) {
            list.objects.forEach(child => {
                this._render(child, false, g.select(ToolClassSelectors.object), false);
            })
        }
    }


    /**
     * Render circle on layer
     * @param layer
     * @param circle
     * @param parent
     * @protected
     */
    protected _renderCircle(layer: Selection<any>, circle: GrCircle, parent: Selection<any>, enableMouseEvents: boolean) {
        const o = this.getObjectOrCreate(layer, circle, "circle", parent, enableMouseEvents)
        const c = o.select(ToolClassSelectors.object);

        c.attr("cx", circle.x);
        c.attr("cy", circle.y);
        c.attr("r", circle.radius);

        this._createStyle(c, circle);


        return o;
    }

    renderCircle(layer: RenderLayer, circle: GrCircle, enableMouseEvents: boolean = false) {
        const o = this._renderCircle(this.getLayer(layer), circle, null, enableMouseEvents);
    }


    /**
     * Render rectangle on layer
     * @param layer
     * @param rectangle
     * @param parent
     * @protected
     */
    protected _renderRectangle(layer: Selection<any>, rectangle: GrRectangle, parent: Selection<any>, enableMouseEvents: boolean) {
        const o = this.getObjectOrCreate(layer, rectangle, "path", parent, enableMouseEvents);

        const r = o.select(ToolClassSelectors.object);


        const d = [
            p2d(rectangle.topLeft, "M"),
            p2d(rectangle.topRight),
            p2d(rectangle.bottomRight),
            p2d(rectangle.bottomLeft), "Z"].join(" ");
        r.attr("d", d);
        this._createStyle(r, rectangle);

        return r;
    }

    renderRectangle(layer: RenderLayer, rectangle: GrRectangle, enableMouseEvents: boolean = true) {
        return this._renderRectangle(this.getLayer(layer), rectangle, null, enableMouseEvents);
    }


    private _renderLine(layer: d3.Selection<any>, line: GrLine, parent: Selection<any>, enableMouseEvents: boolean) {
        const o = this.getObjectOrCreate(layer, line, "line", parent, enableMouseEvents);

        const l = o.select(ToolClassSelectors.object);
        l.attr("x1", line.x1);
        l.attr("y1", line.y1);
        l.attr("x2", line.x2);
        l.attr("y2", line.y2);
        this._createStyle(l, line);


        return l;
    }

    renderLine(layer: RenderLayer, line: GrLine, enableMouseEvents: boolean = true) {
        return this._renderLine(this.getLayer(layer), line, null, enableMouseEvents);
    }

    renderPolygon(layer: RenderLayer, polygon: GrPolygon, enableMouseEvents: boolean = true) {
        return this._renderPolygon(this.getLayer(layer), polygon, null, enableMouseEvents);
    }

    _renderPolygon(layer: Selection<any>, polygon: GrPolygonBase, parent: Selection<any>, enableMouseEvents: boolean) {
        const o = this.getObjectOrCreate(layer, polygon, "path", parent, enableMouseEvents);

        const p = o.select(ToolClassSelectors.object);

        let d;

        if (polygon.points.length === 1) {
            const p = polygon.points[0]
            d = `M ${p.x - 7} ${p.y - 7} L ${p.x + 7} ${p.y + 7} M ${p.x - 7} ${p.y + 7} L ${p.x + 7} ${p.y - 7}`;
        } else {
            d = `M ${polygon.points[0].x} ${polygon.points[0].y}`;

            for (let i = 1; i < polygon.points.length; i++) {
                d += `L ${polygon.points[i].x} ${polygon.points[i].y}`;
            }

            if (polygon.closed) {
                d += " Z";
            }
        }

        p.attr("d", d);


        this._createPathStyle(p, polygon);
        return p;
    }


    renderQuadratic(layer: RenderLayer, polygon: GrQuadratic, enableMouseEvents: boolean = true) {
        return this._renderQuadratic(this.getLayer(layer), polygon, null, enableMouseEvents);
    }

    _renderQuadratic(layer: Selection<any>, polygon: GrQuadratic, parent: Selection<any>, enableMouseEvents: boolean) {
        if (polygon.points.length < 3) {
            return this._renderPolygon(layer, polygon, parent, enableMouseEvents);
        }

        const o = this.getObjectOrCreate(layer, polygon, "path", parent, enableMouseEvents);

        const p = o.select(ToolClassSelectors.object);

        let d = `M ${polygon.points[0].x} ${polygon.points[0].y}`;
        d += ` Q ${polygon.points[1].x} ${polygon.points[1].y}`;
        d += ` , ${polygon.points[2].x} ${polygon.points[2].y}`;

        for (let i = 3; i < polygon.points.length; i++) {
            d += `T ${polygon.points[i].x} ${polygon.points[i].y}`;
        }

        if (polygon.closed) {
            d += " Z";
        }
        p.attr("d", d);


        this._createPathStyle(p, polygon);

        return p;
    }


    public renderBezier(layer: RenderLayer, bezier: GrBezier, enableMouseEvents: boolean = true) {
        return this._renderBezier(this.getLayer(layer), bezier, null, enableMouseEvents);
    }

    private _renderBezier(layer: d3.Selection<any>, bezier: GrBezier, parent: Selection<any>, enableMouseEvents: boolean) {
        if (bezier.points.length < 4) {
            return;
        }

        const o = this.getObjectOrCreate(layer, bezier, "path", parent, enableMouseEvents);

        const p = o.select(ToolClassSelectors.object);

        let d = `M ${bezier.points[0].x} ${bezier.points[0].y}`;
        d += ` C ${bezier.points[1].x} ${bezier.points[1].y}`;
        d += ` , ${bezier.points[2].x} ${bezier.points[2].y}`;

        for (let i = 3; i < bezier.points.length; i++) {
            d += `T ${bezier.points[i].x} ${bezier.points[i].y}`;
        }

        if (bezier.closed) {
            d += " Z";
        }
        p.attr("d", d);


        this._createPathStyle(p, bezier);

        return p;
    }

    protected _createPathStyle(elem: Selection<any>, object: GrPolygonBase): void {
        if (!object.style) {
            if (!object.closed) {
                elem.attr("style", "fill:none");
            }
            return
        }
        elem.attr("style", `fill: ${object.closed ? object.style.fillColor : "none"}; fill-opacity: ${object.style.fillOpacity}; stroke: ${object.style.strokeColor}; stroke-width: ${object.style.strokeWidth}`);
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

            switch (object.type) {
                case ObjectType.Circle:
                    this.renderCircleBRep(g, object as GrCircle);
                    break;

                case ObjectType.Line:
                    this.renderLineBRep(g, object as GrLine);
                    break;

                case ObjectType.Polygon:
                    this.renderPolygonBRep(g, object as GrPolygon);
                    break;

                case ObjectType.Rectangle:
                    this.renderRectangleBRep(g, object as GrRectangle);
                    break;

                case ObjectType.Composite:
                    this.renderCompositeBRep(g, object as GrCompositeObject);
                    break;
                /*
                                case ObjectType.Ellipse:
                                    break;
                                case ObjectType.Square:
                                    break;
                                case ObjectType.Quadratic:
                                    break;
                                case ObjectType.Bezier:
                                    break;
                                case ObjectType.List:
                                    break;
                */
                default:
                    let c = g.select("g" + ToolClassSelectors.boundingBox).selectAll(ToolClassSelectors.boundingBox);
                    if (c.empty()) {
                        // Not yet drawing a bounding representation
                        c = g.select("g" + ToolClassSelectors.boundingBox).append("path")
                            .classed(ToolClasses.boundingBox, true);
                    }

                    const bb = object.boundingBox;

                    c.attr("x", -bb.w / 2 + object.x)
                        .attr("y", -bb.h / 2 + object.y)
                        .attr("width", bb.w)
                        .attr("height", bb.h)
                        .classed(ToolClasses.boundingBox, true);

            }

        }
    }

    protected renderPolygonBRep(g: Selection<any>, polygon: GrPolygon) {

        let c = g.select("g" + ToolClassSelectors.boundingBox).selectAll(ToolClassSelectors.boundingBox);
        if (c.empty()) {
            // Not yet drawing a bounding representation
            c = g.select("g" + ToolClassSelectors.boundingBox).append("path")
                .classed(ToolClasses.boundingBox, true);
        }

        let d;

        if (polygon.points.length === 1) {
            const p = polygon.points[0]
            d = `M ${p.x} ${p.y} m -10 0 a 10 10 0 1 0 20 0 M ${p.x} ${p.y} m -10 0 a 10 10 0 1 1 20 0`;
        } else {
            d = `M ${polygon.points[0].x} ${polygon.points[0].y}`;

            for (let i = 1; i < polygon.points.length; i++) {
                d += `L ${polygon.points[i].x} ${polygon.points[i].y}`;
            }

            if (polygon.closed) {
                d += " Z";
            }
        }
        c.attr("d", d)
            .classed(ToolClasses.boundingBox, true);

    }

    protected renderLineBRep(g: Selection<any>, line: GrLine) {
        let c = g.select("g" + ToolClassSelectors.boundingBox).selectAll(ToolClassSelectors.boundingBox);
        if (c.empty()) {
            // Not yet drawing a bounding representation
            c = g.select("g" + ToolClassSelectors.boundingBox).append("path")
                .classed(ToolClasses.boundingBox, true);
        }

        let w;
        if (!line.style) {
            w = 3;
        } else {
            w = line.style.strokeWidth / 2 + 1;
        }
        const n: Point2D = line.end.copy.sub(line.start).getPerpendicular().normalize().scale(w);

        const p1 = line.start.copy.add(n);
        const p2 = line.end.copy.add(n);
        const p3 = line.start.copy.sub(n);
        const p4 = line.end.copy.sub(n);

        let d = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
        d += `M ${p3.x} ${p3.y} L ${p4.x} ${p4.y}`;


        c.attr("d", d)
            .classed(ToolClasses.boundingBox, true);

    }

    protected renderCircleBRep(g: Selection<any>, circle: GrCircle) {
        let c = g.select("g" + ToolClassSelectors.boundingBox).selectAll(ToolClassSelectors.boundingBox);
        if (c.empty()) {
            // Not yet drawing a bounding representation
            c = g.select("g" + ToolClassSelectors.boundingBox).append("circle")
                .classed(ToolClasses.boundingBox, true);
        }

        c.attr("cx", circle.center.x)
            .attr("cy", circle.center.y)
            .attr("r", circle.radius + circle.style.strokeWidth / 2)
            .classed(ToolClasses.boundingBox, true);
    }

    protected renderRectangleBRep(g: Selection<any>, rectangle: GrRectangle) {
        let c = g.select("g" + ToolClassSelectors.boundingBox).selectAll(ToolClassSelectors.boundingBox);
        if (c.empty()) {
            // Not yet drawing a bounding representation
            c = g.select("g" + ToolClassSelectors.boundingBox).append("path")
                .classed(ToolClasses.boundingBox, true);
        }

        const d = [
            p2d(rectangle.topLeft, "M"),
            p2d(rectangle.topRight),
            p2d(rectangle.bottomRight),
            p2d(rectangle.bottomLeft), "Z"].join(" ");
        c.attr("d", d);
    }


    protected renderCompositeBRep(g: Selection<any>, compositeObject: GrCompositeObject) {
        let c = g.select("g" + ToolClassSelectors.boundingBox).selectAll(ToolClassSelectors.boundingBox);
        if (c.empty()) {
            // Not yet drawing a bounding representation
            c = g.select("g" + ToolClassSelectors.boundingBox).append("path")
                .classed(ToolClasses.boundingBox, true);
        }

        const d = [
            p2d(compositeObject.topLeft, "M"),
            p2d(compositeObject.topRight),
            p2d(compositeObject.bottomRight),
            p2d(compositeObject.bottomLeft), "Z"].join(" ");
        c.attr("d", d);
    }

    public removeBoundingRepresentation(object: GrObject) {
        const g = this.getObject(this._objectLayer, object);
        if (g) {
            g.select("g" + ToolClassSelectors.boundingBox).selectAll(ToolClassSelectors.boundingBox).remove();
        }
    }

    public updateHandle(object: GrObject, id: string, p: Point2D) {
        const g = this.getObject(this._objectLayer, object);
        if (g) {
            g.select(`#${object.uniqueName}-handle-${id}`)
                .attr("cx", p.x)
                .attr("cy", p.y)
        }
    }

    public renderHandle(object: GrObject, id: string, p: Point2D, onMouseEvent: HandleMouseCallBack, data?: any) {
        const g = this.getObject(this._objectLayer, object);
        if (g) {
            this._objectInfo[object.uniqueName].handles.push(p);
            const handle = g.append("circle")
                .attr("cx", p.x)
                .attr("cy", p.y)
                .attr("r", HANDLE_RADIUS)
                .attr("id", `${object.uniqueName}-handle-${id}`)
                .data<Point2D>([p])
                .classed(ToolClasses.handle, true);

            if (onMouseEvent) {
                this._attachHandleMouseEvents(object, handle, onMouseEvent, data);
            }
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


    protected makeInfoHandle(): InfoHandle {
        return "__svg_rndr_info_" + (infoHandle++);
    }

    public renderInfoText(position: Point2D, text: string): InfoHandle {
        const handle = this.makeInfoHandle();

        this._infoLayer.select("#" + handle).remove();

        this._infoLayer.append("text")
            .attr("x", position.x)
            .attr("y", position.y)
            .attr("id", handle)
            .text(text);

        return handle;
    }

    public updateInfoText(handle: InfoHandle, text: string, position?: Point2D) {
        const i = this._infoLayer.select("#" + handle);

        if (i.empty()) {
            return;
        }

        i.append("text")
            .text(text);

        if (position) {
            i.attr("x", position.x)
                .attr("y", position.y)
        }
    }

    public removeInfo(handle: InfoHandle) {
        this._infoLayer.selectAll("#" + handle).remove();
    }

    public clearInfo() {
        this._infoLayer.selectAll("*").remove();
    }

}
// @ts-ignore
import d3 from "sap/ui/thirdparty/d3";
import {GrObject, ObjectType} from "../../../Geo/GrObject";
import {HandleMouseCallBack, ObjectClickCallback, ObjectRenderer, POICallback, RenderLayer} from "./ObjectRenderer";
import {Selection} from "d3";
import {InteractionEventData, InteractionEvents} from "../InteractionEvents";
import {GrCircle} from "../../../Geo/GrCircle";
import {GrRectangle} from "../../../Geo/GrRectangle";
import {GrLine} from "../../../Geo/GrLine";
import {Point2D} from "../../../Geo/GeoMath";
import {GrBezier, GrPolygon, GrQuadratic} from "../../../Geo/GrPolygon";
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
    rot: number,
    scaleX: number,
    scaleY: number,
    handles: Array<Point2D>
}


/**
 * Renderer using SVG. This uses d3 (3.4) for rendering.
 */
export class SvgObjectRenderer extends ObjectRenderer {

    protected _renderedObjects: Array<GrObject>;
    protected _objectLayer: Selection<any>;
    protected _infoLayer: Selection<any>;
    protected _interactionLayer: Selection<any>;
    private _poiRenderingEnabled: boolean;
    private _objectInfo: { [key: string]: ObjectInfo };

    constructor(container: Selection<any>, onObjectClick: ObjectClickCallback = null) {
        super(onObjectClick);
        this._setupLayers(container);
        this._objectInfo = {}
    }

    protected _setupLayers(container: Selection<any>): void {
        this._objectLayer = container.append("g");
        this._infoLayer = container.append("g");
        this._interactionLayer = container.append("g");
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

        switch (object.type) {
            case ObjectType.Circle:
                this._renderCircle(this._objectLayer, object as GrCircle);
                break;

            case ObjectType.Rectangle:
                this._renderRectangle(this._objectLayer, object as GrRectangle);
                break;

            case ObjectType.Ellipse:
                break;
            case ObjectType.Square:
                break;

            case ObjectType.Line:
                this._renderLine(this._objectLayer, object as GrLine);
                break;

            case ObjectType.Polygon:
                this._renderPolygon(this._objectLayer, object as GrPolygon);
                break;

            case ObjectType.Quadratic:
                this._renderQuadratic(this._objectLayer, object as GrQuadratic);
                break;

            case ObjectType.Bezier:
                this._renderBezier(this._objectLayer, object as GrBezier);
                break;

        }

        if (selected && object.type !== ObjectType.List) {
            this.renderBoundingRepresentation(object)
        } else {
            this.removeBoundingRepresentation(object);
        }
    }

    _renderObjectList(objectList: GrObjectList, selected) {
        objectList.objects.forEach(object => this.render(object, selected))
    }


    enablePOI(enabled: boolean, poiCallback: POICallback, except: Array<GrObject>) {
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

        const poiIds = Object.keys(object.pointsOfInterest);
        Object.values(object.pointsOfInterest)
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
    protected getObjectOrCreate(layer: Selection<any>, object: GrObject, svgTag: string): Selection<any> {
        let svgGroup = layer.select("#" + object.id);
        if (svgGroup.empty()) {
            svgGroup = layer.append("g").attr("id", object.id);

            const info = {
                x: object.x,
                y: object.y,
                rot: object.rotation,
                scaleX: object.scaleX,
                scaleY: object.scaleY,
                handles: []
            }

            this._objectInfo[object.uniqueName] = info;

            const svgObject = svgGroup.append(svgTag).attr("class", ToolClasses.object);
            svgObject.on("click", () => {
                this._fireSelect(object);
            });

            // Slots to better control that handles are always painted on top of handles
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

    /**
     * Render circle on layer
     * @param layer
     * @param circle
     * @protected
     */
    protected _renderCircle(layer: Selection<any>, circle: GrCircle) {
        const o = this.getObjectOrCreate(layer, circle, "circle")
        const c = o.select(ToolClassSelectors.object);

        c.attr("cx", circle.x);
        c.attr("cy", circle.y);
        c.attr("r", circle.radius);

        this.addRotation(circle, o)
        this._createStyle(c, circle);


        return o;
    }

    renderCircle(layer: RenderLayer, circle: GrCircle) {
        const o = this._renderCircle(this.getLayer(layer), circle);
    }

    protected addRotation(object: GrObject, svgGroup: Selection<any>) {

        svgGroup.select(ToolClassSelectors.object).attr("transform", `rotate( ${object.rotation} ${object.x} ${object.y})`)

        const bb = svgGroup.select(ToolClassSelectors.boundingBox)
        if (!bb.empty()) {
            bb.attr("transform", `rotate( ${object.rotation} ${object.x} ${object.y})`)
        }

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
        r.attr("x", -rectangle.width / 2 + rectangle.x);
        r.attr("y", -rectangle.height / 2 + rectangle.y);
        r.attr("width", rectangle.width);
        r.attr("height", rectangle.height);
        this._createStyle(r, rectangle);
        this.addRotation(rectangle, o)

        return r;
    }

    renderRectangle(layer: RenderLayer, rectangle: GrRectangle) {
        return this._renderRectangle(this.getLayer(layer), rectangle);
    }


    private _renderLine(layer: d3.Selection<any>, line: GrLine) {
        const o = this.getObjectOrCreate(layer, line, "line");

        const l = o.select(ToolClassSelectors.object);
        l.attr("x1", line.x1);
        l.attr("y1", line.y1);
        l.attr("x2", line.x2);
        l.attr("y2", line.y2);
        this._createStyle(l, line);


        return l;
    }

    renderLine(layer: RenderLayer, line: GrLine) {
        return this._renderLine(this.getLayer(layer), line);
    }

    renderPolygon(layer: RenderLayer, polygon: GrPolygon) {
        return this._renderPolygon(this.getLayer(layer), polygon);
    }

    _renderPolygon(layer: Selection<any>, polygon: GrPolygon) {
        const o = this.getObjectOrCreate(layer, polygon, "path");

        const p = o.select(ToolClassSelectors.object);

        let d = `M ${polygon.points[0].x} ${polygon.points[0].y}`;

        for (let i = 1; i < polygon.points.length; i++) {
            d += `L ${polygon.points[i].x} ${polygon.points[i].y}`;
        }

        if (polygon.closed) {
            d += " Z";
        }
        p.attr("d", d);


        this._createPathStyle(p, polygon);
        this.addRotation(polygon, o);

        return p;
    }


    renderQuadratic(layer: RenderLayer, polygon: GrQuadratic) {
        return this._renderQuadratic(this.getLayer(layer), polygon);
    }

    _renderQuadratic(layer: Selection<any>, polygon: GrQuadratic) {
        if (polygon.points.length < 3) {
            return this._renderPolygon(layer, polygon);
        }

        const o = this.getObjectOrCreate(layer, polygon, "path");

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
        this.addRotation(polygon, o);

        return p;
    }


    public renderBezier(layer: RenderLayer, bezier: GrBezier) {
        return this._renderBezier(this.getLayer(layer), bezier);
    }

    private _renderBezier(layer: d3.Selection<any>, bezier: GrBezier) {
        if (bezier.points.length < 4) {
            return;
        }

        const o = this.getObjectOrCreate(layer, bezier, "path");

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
        this.addRotation(bezier, o);

        return p;
    }

    protected _createPathStyle(elem: Selection<any>, object: GrPolygon): void {
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
            let c = g.select("g" + ToolClassSelectors.boundingBox).selectAll(ToolClassSelectors.boundingBox);

            if (c.empty()) {
                // Already drawing a bounding representation
                c = g.select("g" + ToolClassSelectors.boundingBox).append("rect")
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

    public removeBoundingRepresentation(object: GrObject) {
        const g = this.getObject(this._objectLayer, object);
        if (g) {
            g.select("g" + ToolClassSelectors.boundingBox).selectAll(ToolClassSelectors.boundingBox).remove();
        }
    }

    public updateHandle(object: GrObject, id: string, p: Point2D) {
        const g = this.getObject(this._objectLayer, object);
        if (g) {
            g.select("g" + ToolClassSelectors.handle).select(`#${object.uniqueName}-handle-${id}`)
                .attr("cx", p.x)
                .attr("cy", p.y)
        }
    }

    public renderHandle(object: GrObject, id: string, p: Point2D, onMouseEvent: HandleMouseCallBack, data?: any) {
        const g = this.getObject(this._objectLayer, object);
        if (g) {
            this._objectInfo[object.uniqueName].handles.push(p);
            const handle = g.select("g" + ToolClassSelectors.handle).append("circle")
                .attr("cx", p.x)
                .attr("cy", p.y)
                .attr("r", HANDLE_RADIUS)
                .attr("id", `${object.uniqueName}-handle-${id}`)
                .data<Point2D>([p])
                .classed(ToolClasses.handle, true);

            this._attachHandleMouseEvents(object, handle, onMouseEvent, data);
        }
    }

    public removeAllHandles(object): void {
        const g = this.getObject(this._objectLayer, object);
        if (g) {
            g.select("g" + ToolClassSelectors.handle).selectAll(ToolClassSelectors.handle).remove();
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
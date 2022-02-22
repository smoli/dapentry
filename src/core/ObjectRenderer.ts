/**
 * Abstraction for rendering objects.
 *
 * h2. Objects
 *
 * There are explicit functions for drawing all the object types
 *
 * h2. Bounding representation
 *
 * There are explicit functions for drawing a bounding representation on an object.
 * A bounding representation in its simplest form is a bounding box. It is a shape
 * that encloses the whole object. The renderer may choose to draw more specific
 * bounding representations for different object types.
 *
 * h2. Handles
 *
 * Handles are visual items that for example can be used by the user to manipulate an object.
 *
 * @module
 */

import {GrObject} from "../geometry/GrObject";
import {InteractionEventData} from "./InteractionEvents";
import {GrCircle} from "../geometry/GrCircle";
import {GrRectangle} from "../geometry/GrRectangle";
import {GrLine} from "../geometry/GrLine";
import {GrBezier, GrPolygon, GrQuadratic} from "../geometry/GrPolygon";
import {Point2D} from "../geometry/Point2D";
import {GrText} from "../geometry/GrText";

/**
 * Callback signature for functions invoked when an object is clicked
 *
 * Todo: Maybe turn this into a generic MouseCallback with InteractionEventData
 */
export type ObjectClickCallback = (object: GrObject) => void;

export type POICallback = (object:GrObject, poiId:number, hit:boolean) => void;

export type MouseHandler = (MouseEvent) => void;


export type InfoHandle = string;

/**
 * Callback signature for functions that are invoked when an a handle (e.g. for resizing) on an
 * object is interacted with by the user.
 */
export type HandleMouseCallBack = (object: GrObject, event: InteractionEventData, data: any) => void;

/**
 * Layers that need to be supported by the renderer.
 * The `Objects`-Layer displays the created objects
 * The `Interaction`-Layer displays other visual clues that represent the current interaction
 * of by the user with the drawing. The `Interaction`-layer should always be rendered on top of
 * the `Object`-layer.
 */
export enum RenderLayer {
    Objects = "Objects",
    Interaction = "Interaction"
}

export abstract class ObjectRenderer {

    protected _objectClickCallback: ObjectClickCallback;
    protected _poiAvailable: boolean;

    protected constructor(onObjectClick: ObjectClickCallback = null, poiAvailable: boolean) {
        this._objectClickCallback = onObjectClick;
        this._poiAvailable = poiAvailable;
    }

    public abstract setupMouseHandlers(onMouseMove: MouseHandler,
                       onClick: MouseHandler,
                       onAlternateClick: MouseHandler,
                       onMouseDown: MouseHandler,
                       onMouseUp: MouseHandler);

    protected _fireSelect(object: GrObject): void {
        if (this._objectClickCallback) {
            this._objectClickCallback(object);
        }
    }

    public abstract reset():void;

    /**
     * Render an object on the `Object`-layer.
     *
     * @link RenderLayer
     * @param object    Object to render
     * @param selected  Render selected
     */
    public abstract render(object: GrObject, selected: boolean): void;

    public abstract remove(object: GrObject): void;
    
    /**
     * Clear the layer
     */
    public abstract clear(layer:RenderLayer): void;

    /**
     * Render a circle on the given layer.
     * @param layer
     * @param circle
     */
    public abstract renderCircle(layer: RenderLayer, circle: GrCircle, enableMouseEvents: boolean): void;

    /**
     * Render a rectangle on the given layer.
     * @param layer
     * @param rect
     */
    public abstract renderRectangle(layer:RenderLayer, rect: GrRectangle, enableMouseEvents: boolean): void;

    /**
     * Render a line on the given layer.
     * @param layer
     * @param line
     */
    public abstract renderLine(layer:RenderLayer, line: GrLine, enableMouseEvents: boolean): void;

    /**
     * Render a polygon on the given layer.
     * @param layer
     * @param polygon
     */
    public abstract renderPolygon(layer:RenderLayer, polygon: GrPolygon, enableMouseEvents: boolean): void;
    public abstract renderQuadratic(layer:RenderLayer, quadric: GrQuadratic, enableMouseEvents: boolean): void;
    public abstract renderBezier(layer:RenderLayer, bezier: GrBezier, enableMouseEvents: boolean): void;


    /**
     * Render a text on the given layer.
     * @param layer
     * @param text
     * @param enableMouseEvents
     */
    public abstract renderText(layer: RenderLayer, text: GrText, enableMouseEvents: boolean): void;

    /**
     * Render the bounding representation for an object on the object layer
     * @param object
     */
    public abstract renderBoundingRepresentation(object: GrObject): void;



    /**
     * Remove bounding representation from object representation on the object layer
     * @param object
     * @private
     */
    public abstract removeBoundingRepresentation(object: GrObject): void;

    /**
     * Render a handle on the object on the object layer.
     *
     * The x and y position is given **relative to the origin** of the object.
     *
     * @param object            Object to render the handle on
     * @param p
     * @param id
     * @param onMouseEvent      callback that is called when the user interacts with the handle.
     * @param data              arbitrary data that is passed to the callback.
     */
    public abstract renderHandle(object: GrObject, id: string, p: Point2D, onMouseEvent: HandleMouseCallBack, data?: any): void;
    public abstract updateHandle(object: GrObject, id: string, p: Point2D);
    /**
     * Remove all handles from the object's representation.
     * @param object
     */
    public abstract removeAllHandles(object): void;

    public abstract enablePOI(enabled:boolean, poiCallback?: POICallback, except?:Array<GrObject>):void;

    /**
     * Render informative text at position given.
     * @param position
     * @param text
     * @returns A handle that can be used to manipulate the rendered info object
     */
    public abstract renderInfoText(position: Point2D, text: string):InfoHandle;

    public abstract updateInfoText(handle:InfoHandle, text: string, position?: Point2D);

    public abstract removeInfo(handle:InfoHandle);

    public abstract clearInfo();

    public abstract pointerCoordsFromEvent(event:MouseEvent);
}



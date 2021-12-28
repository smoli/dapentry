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

import {GRCircle, GrObject, GRRectangle} from "./GrObject";
import {InteractionEventData} from "../InteractionEvents";

/**
 * Callback signature for functions invoked when an object is clicked
 *
 * Todo: Maybe turn this into a generic MouseCallback with InteractionEventData
 */
export type ObjectClickCallback = (object: GrObject) => void;



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

    protected constructor(onObjectClick: ObjectClickCallback = null) {
        this._objectClickCallback = onObjectClick;
    }

    protected _fireSelect(object: GrObject): void {
        if (this._objectClickCallback) {
            this._objectClickCallback(object);
        }
    }

    /**
     * Render an object on the `Object`-layer.
     *
     * @link RenderLayer
     * @param object    Object to render
     * @param selected  Render selected
     */
    public abstract render(object: GrObject, selected: boolean): void;

    /**
     * Clear the layer
     */
    public abstract clear(layer:RenderLayer): void;

    /**
     * Render a circle on the given layer.
     * @param layer
     * @param circle
     */
    public abstract renderCircle(layer: RenderLayer, circle: GRCircle): void;

    /**
     * Render a rectangle on the given layer.
     * @param layer
     * @param rect
     */
    public abstract renderRectangle(layer:RenderLayer, rect: GRRectangle): void;

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
     * @param x                 x-Position of the handle.
     * @param y                 y-Position of the handle
     * @param onMouseEvent      callback that is called when the user interacts with the handle.
     * @param data              arbitrary data that is passed to the callback.
     */
    public abstract renderHandle(object: GrObject, x: number, y: number, onMouseEvent: HandleMouseCallBack, data?: any): void;

    /**
     * Remove all handles from the object's representation.
     * @param object
     */
    public abstract removeAllHandles(object): void;
}



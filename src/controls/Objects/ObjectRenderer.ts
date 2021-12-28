import {GRCircle, GrObject, GRRectangle} from "./GrObject";

export type ObjectClickCallback = (object:GrObject) => void;

export abstract class ObjectRenderer {

    protected _objectClickCallback:ObjectClickCallback;

    protected constructor(onObjectClick:ObjectClickCallback = null) {
        this._objectClickCallback = onObjectClick;
    }

    protected _fireSelect(object:GrObject) {
        if (this._objectClickCallback) {
            this._objectClickCallback(object);
        }
    }

    /**
     * Render an object.
     * @param object    Object to render
     * @param selected  Render selected
     */
    public abstract render(object:GrObject, selected:boolean);

    /**
     * Clear the layer
     */
    public abstract clear();

    /**
     * Render a circle
     * @param circle
     */
    public abstract renderCircle(circle:GRCircle);

    /**
     * Render a rectangle
     * @param rect
     */
    public abstract renderRectangle(rect:GRRectangle);

    /**
     * Render the bounding box for an object
     * @param object
     */
    public abstract renderBoundingBox(object:GrObject);

    /**
     * Remove bounding box from object representation
     * @param object
     * @private
     */
    public abstract removeBoundingBox(object: GrObject);
}



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

    public abstract render(object:GrObject, selected:boolean);
    public abstract clear();
    public abstract renderCircle(circle:GRCircle);
    public abstract renderRectangle(rect:GRRectangle);
}


import {GRCircle, GrObject, GRRectangle} from "./GrObject";

export abstract class ObjectRenderer {
    protected constructor() {
    }

    public abstract render(object:GrObject);
    public abstract clear();
    public abstract renderCircle(circle:GRCircle);
    public abstract renderRectangle(rect:GRRectangle);
}


import {GrObject} from "./GrObject";

export abstract class ObjectRenderer {
    protected constructor() {
    }

    public abstract render(object:GrObject);
}


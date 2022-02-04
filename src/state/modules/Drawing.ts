import {GrObject} from "../../geometry/GrObject";

export interface DrawingState {
    objects: Array<GrObject>,
    selection: Array<GrObject>
}

export const drawingState = {
    state():DrawingState {
        return {
            objects: [],
            selection: []
        }
    }
}
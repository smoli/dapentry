import {GrObject} from "@/geometry/GrObject";

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
    },

    mutations: {
        setObjects(state:DrawingState, objects: Array<GrObject>) {
            state.objects = objects;
        },

        selectObject(state:DrawingState, object: GrObject) {
            if (state.selection.indexOf(object) === -1) {
                // Replacing the whole array makes watching working on the plain value
                state.selection = [...state.selection, object]
            }
        },

        deselectObject(state:DrawingState, object: GrObject) {
            const i = state.selection.indexOf(object);
            if (i !== -1) {
                // Replacing the whole array makes watching working on the plain value
                state.selection = state.selection.filter(o => o !== object);
            }
        },

        deselectAll(state:DrawingState) {
            // Replacing the whole array makes watching working on the plain value
            state.selection = [];
        }
    },

    getters: {
        isObjectSelected: state => object => {
            return state.selection.indexOf(object) !== -1;
        },

        objects(state) {
            return state.objects;
        }

    }
}
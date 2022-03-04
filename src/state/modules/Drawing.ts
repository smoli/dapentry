import {GrObject} from "../../geometry/GrObject";
import {AspectRatio} from "../../geometry/GrCanvas";


interface DrawingDimensions {
    x?: 0,
    y?: 0,
    width: number,
    height: number
}

export interface DrawingState {
    dimensions: DrawingDimensions,
    aspectRatio: AspectRatio,
    objects: Array<GrObject>,
    selection: Array<GrObject>,
    preview: string
}

export const drawingState = {
    state(): DrawingState {
        return {
            dimensions: { x: 0, y: 0, width: 100, height: 100 },
            aspectRatio: AspectRatio.ar1_1,
            objects: [],
            selection: [],
            preview: ""
        }
    },

    getters: {
        dimensions(state): DrawingDimensions {
            return state.dimensions;
        },

        isObjectSelected: state => object => {
            return state.selection.indexOf(object) !== -1;
        },

        objects(state) {
            return state.objects;
        },

        selection(state) {
            return state.selection;
        },

        object: (state:DrawingState) => (uniqueName:string) => {
            return state.objects.find(o => o.uniqueName === uniqueName);
        }
    },

    mutations: {

        setPreview(state: DrawingState, preview: string) {
            state.preview = preview;
            console.log(preview);
        },

        setDimensions(state: DrawingState, newDimensions: DrawingDimensions) {
            state.dimensions = { ...state.dimensions, ...newDimensions };
        },

        setObjects(state: DrawingState, objects: Array<GrObject>) {
            state.objects = objects;
        },

        selectObject(state: DrawingState, object: GrObject) {
            if (state.selection.indexOf(object) === -1) {
                // Replacing the whole array makes watching working on the plain value
                state.selection = [...state.selection, object]
            }
        },

        deselectObject(state: DrawingState, object: GrObject) {
            const i = state.selection.indexOf(object);
            if (i !== -1) {
                // Replacing the whole array makes watching working on the plain value
                state.selection = state.selection.filter(o => o !== object);
            }
        },

        deselectAll(state: DrawingState) {
            // Replacing the whole array makes watching working on the plain value
            state.selection = [];
        },

        setAspectRatio(state:DrawingState, value: AspectRatio) {
            state.aspectRatio = value;
        }

    }
}
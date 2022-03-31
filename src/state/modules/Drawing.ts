import {GrObject} from "../../geometry/GrObject";
import {AspectRatio} from "../../geometry/AspectRatio";
import {AppConfig} from "../../core/AppConfig";


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
    preview: string,
    name: string,
    description: string,
    id: number,
    createdBy: number
}

function getDefaultState():DrawingState {
    return {
        dimensions: { x: 0, y: 0, width: 1000, height: 1000 },
        aspectRatio: AppConfig.Drawing.InitialAspectRatio,
        objects: [],
        selection: [],
        preview: "",
        name: null,
        description: null,
        id: -1,
        createdBy: -1
    }
}

export const drawingState = {
    state(): DrawingState {
        return getDefaultState();
    },

    getters: {
        alreadyStoredOnBackend(state: DrawingState): boolean {
            return state.id !== -1;
        },

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

        reset(state: DrawingState) {
            Object.assign(state, getDefaultState());
        },

        setNameAndDescription(state: DrawingState, payload: { name: string, description: string} ) {
            state.name = payload.name;
            state.description = payload.description;
        },

        setId(state: DrawingState, id: number) {
            state.id = id;
        },

        setCreatedBy(state: DrawingState, userId: number) {
            state.createdBy = userId;
        },

        setPreview(state: DrawingState, preview: string) {
            state.preview = preview;
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
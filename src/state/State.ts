import {CommitOptions, Store} from "vuex";
import {AppStore} from "./AppStore";
import {ToolNames} from "../tools/ToolNames";
import {GrObject} from "../geometry/GrObject";
import {h} from "vue";


const mutations = {
    tool: {
        switch: "tool/switch",
        setReferenceObject: "tool/setReferenceObject",
        setKeyPress: "tool/setKeyPress"
    },

    code: {
        add: "code/add",
        insert: "code/insert"
    },

    drawing: {
        dimensions: "drawing/setDimensions",
        setObjects: "drawing/setObjects",
        selectObject: "drawing/selectObject",
        deselectObject: "drawing/deselectObject",
        deselectAll: "drawing/deselectAll",
        isObjectSelected: "drawing/isObjectSelected"
    }
}

const getters = {
    code: {
        fullCode: "code/fullCode"
    },
    drawing: {
        objects: "drawing/objects",
        isObjectSelected: "drawing/isObjectSelected",
        selection: "drawing/selection"
    },
    tool: {
        referenceObject: "tool/referenceObject"
    }
}

export class State {
    private readonly _store: Store<AppStore>;

    constructor(store:Store<AppStore>) {
        this._store = store;
    }

    get store():Store<AppStore> {
        return this._store;
    }

    protected commit(type: string, payload?: any, options?: CommitOptions) {
        this._store.commit(type, payload, options);
    }

    protected get(type:string, ...params):any {
        console.log("Getting", type)

        if (params.length) {
            return this._store.getters[type](...params);
        } else {
            return this._store.getters[type];
        }
    }

    get objects():Array<GrObject> {
        return this.get(getters.drawing.objects);
    }

    get fullCode():Array<string> {
        return this._store.getters["code/fullCode"]
    }

    switchTool(newTool:ToolNames) {
        this.commit(mutations.tool.switch, newTool);
    }

    setReferenceObjectForTool(object: GrObject = null) {
        this.commit(mutations.tool.setReferenceObject, object);
    }

    passKeyPressToTool(event: KeyboardEvent) {
        this.commit(mutations.tool.setKeyPress, event);
    }

    get referenceObjectForTool():GrObject {
        return this.get(getters.tool.referenceObject);
    }

    addCode(code:Array<string>) {
        this.commit(mutations.code.add, code);
    }


    setDrawingDimensions(width: number, height: number) {
        this.commit(mutations.drawing.dimensions, { width, height });
    }

    setObjectsOnDrawing(objects: Array<GrObject>) {
        this.commit(mutations.drawing.setObjects, objects);
    }

    selectObject(object: GrObject) {
        this.commit(mutations.drawing.selectObject, object);
    }
    
    deselectObject(object: GrObject) {
        this.commit(mutations.drawing.deselectObject, object);
    }

    deselectAll() {
        this.commit(mutations.drawing.deselectAll);
    }

    isObjectSelected(object: GrObject) {
        return this.get(getters.drawing.isObjectSelected, object);
    }

    get selection():Array<GrObject> {
        return this.get(getters.drawing.selection);
    }

}
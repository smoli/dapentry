import {CommitOptions, Store} from "vuex";
import {AppStore} from "./AppStore";
import {ToolNames} from "../tools/ToolNames";
import {GrObject} from "../geometry/GrObject";
import {InteractionEventData} from "@/drawing/InteractionEvents";


const actions = {
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
        isObjectSelected: "drawing/isObjectSelected"
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
        this.commit(actions.tool.switch, newTool);
    }

    setReferenceObjectForTool(object: GrObject = null) {
        this.commit(actions.tool.setReferenceObject, object);
    }

    passKeyPressToTool(event: KeyboardEvent) {
        this.commit(actions.tool.setKeyPress, event);
    }

    get referenceObjectForTool():GrObject {
        return this.get(getters.tool.referenceObject);
    }

    addCode(code:Array<string>) {
        this.commit(actions.code.add, code);
    }

    setObjectsOnDrawing(objects: Array<GrObject>) {
        this.commit(actions.drawing.setObjects, objects);
    }

    selectObject(object: GrObject) {
        this.commit(actions.drawing.selectObject, object);
    }
    
    deselectObject(object: GrObject) {
        this.commit(actions.drawing.deselectObject, object);
    }

    deselectAll() {
        this.commit(actions.drawing.deselectAll);
    }

    isObjectSelected(object: GrObject) {
        return this.get(getters.drawing.isObjectSelected, object);
    }

}
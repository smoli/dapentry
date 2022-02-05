import {CommitOptions, Store} from "vuex";
import {AppStore} from "./AppStore";
import {ToolNames} from "../tools/ToolNames";
import {codeState} from "./modules/Code";
import {GrObject} from "../geometry/GrObject";


const actions = {
    tool: {
        switch: "tool/switch"
    },

    code: {
        add: "code/add",
        insert: "code/insert"
    },

    drawing: {
        setObjects: "drawing/setObjects"
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

    get fullCode():Array<string> {
        return this._store.getters["code/fullCode"]
    }

    switchTool(newTool:ToolNames) {
        this.commit(actions.tool.switch, newTool);
    }

    addCode(code:Array<string>) {
        this.commit(actions.code.add, code);
    }

    setObjectsOnDrawing(objects: Array<GrObject>) {
        this.commit(actions.drawing.setObjects, objects);
    }
    
}
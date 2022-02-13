import {CommitOptions, Store} from "vuex";
import {AppStore} from "./AppStore";
import {ToolNames} from "../tools/ToolNames";
import {GrObject} from "../geometry/GrObject";
import {AspectRatio} from "../geometry/GrCanvas";
import {I18n} from "vue-i18n";
import {DataField, DataFieldValue} from "./modules/Data";
import {AppConfig} from "../core/AppConfig";


const mutations = {
    tool: {
        switch: "tool/switch",
        setReferenceObject: "tool/setReferenceObject",
        setKeyPress: "tool/setKeyPress"
    },

    code: {
        set: "code/setCode",
        add: "code/add",
        insert: "code/insert",
        replaceStatement: "code/replaceStatement",
        clearSelection: "code/clearSelection",
        setSelection: "code/setSelection",
        addToSelection: "code/addToSelection"
    },

    drawing: {
        dimensions: "drawing/setDimensions",
        setObjects: "drawing/setObjects",
        selectObject: "drawing/selectObject",
        deselectObject: "drawing/deselectObject",
        deselectAll: "drawing/deselectAll",
        isObjectSelected: "drawing/isObjectSelected",
        setAspectRatio: "drawing/setAspectRatio"
    },

    data: {
        setData: "data/setData",
        addField: "data/addField",
        removeField: "data/removeField",
        setFieldValue: "data/setFieldValue",
        addValueToField: "data/addValueToField"
    }
}

const getters = {
    code: {
        fullCode: "code/fullCode",
        annotatedSelection: "code/annotatedSelection"
    },

    data: {
        newFieldName: "data/newFieldName",
        dataCode: "data/dataCode",
        dataCodeLength: "data/dataCodeLength"
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
    private _i18n: I18n;

    constructor(store: Store<AppStore>, i18n: I18n) {
        this._store = store;
        this._i18n = i18n;
    }

    get store(): Store<AppStore> {
        return this._store;
    }

    setLocale(locale: string) {
        this._i18n.global.locale = locale;
    }

    get locale(): string {
        const locale = this._i18n.global.locale;
        return locale as string;
    }

    protected commit(type: string, payload?: any, options?: CommitOptions) {
        this._store.commit(type, payload, options);
    }

    protected get(type: string, ...params): any {
        console.log("Getting", type)

        if (params.length) {
            return this._store.getters[type](...params);
        } else {
            return this._store.getters[type];
        }
    }

    get objects(): Array<GrObject> {
        return this.get(getters.drawing.objects);
    }

    public setCode(code: Array<string>) {
        this.commit(mutations.code.set, code);
    }

    get fullCode(): Array<string> {
        return [
            ...this.get(getters.data.dataCode),
            ...this.get(getters.code.fullCode)
        ];
    }

    get dataCodeLength(): number {
        return this.get(getters.data.dataCodeLength);
    }

    addCode(code: Array<string>) {
        this.commit(mutations.code.add, code);
    }

    replaceStatement(index: number, ...newStatements: Array<string>) {
        this.commit(mutations.code.replaceStatement, { index, newStatements })
    }

    switchTool(newTool: ToolNames) {
        this.commit(mutations.tool.switch, newTool);
    }

    setReferenceObjectForTool(object: GrObject = null) {
        this.commit(mutations.tool.setReferenceObject, object);
    }

    passKeyPressToTool(event: KeyboardEvent) {
        this.commit(mutations.tool.setKeyPress, event);
    }

    get referenceObjectForTool(): GrObject {
        return this.get(getters.tool.referenceObject);
    }

    setAspectRatio(ar: AspectRatio) {
        this.commit(mutations.drawing.setAspectRatio, ar);
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

    get selection(): Array<GrObject> {
        return this.get(getters.drawing.selection);
    }

    clearCodeSelection() {
        this.commit(mutations.code.clearSelection);
    }

    setCodeSelection(selection: Array<number>) {
        this.commit(mutations.code.setSelection, selection);
    }

    addToCodeSelection(selection: Array<number>) {
        this.commit(mutations.code.addToSelection, selection);
    }

    get codeSelection(): Array<number> {
        return this._store.state.code.selectedLines;
    }

    getNewDataFieldName(prefix: string = AppConfig.Data.fieldNamePrefix): string {
        return this.get(getters.data.newFieldName, prefix)
    }

    getDataField(name: string) {
        return this._store.state.data.fields.find(f => f.name === name);
    }

    setData(fields: Array<DataField>) {
        return this.commit(mutations.data.setData, fields);
    }

    addDataField(name: string, value: DataFieldValue) {
        return this.commit(mutations.data.addField, { name, value });
    }

    addValueToDataField(name: string, value: (number | string)) {
        return this.commit(mutations.data.addValueToField, { name, value });
    }

    removeDataField(name: string) {
        return this.commit(mutations.data.removeField, name);
    }

    setDateFieldValue(name: string, value: DataFieldValue) {
        return this.commit(mutations.data.setFieldValue, { name, value });
    }

}
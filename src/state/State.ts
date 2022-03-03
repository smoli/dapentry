import {CommitOptions, Store} from "vuex";
import {AppStore} from "./AppStore";
import {ToolNames} from "../tools/ToolNames";
import {GrObject} from "../geometry/GrObject";
import {AspectRatio} from "../geometry/GrCanvas";
import {I18n} from "vue-i18n";
import {DataField, DataFieldValue} from "./modules/Data";
import {AppConfig} from "../core/AppConfig";
import {ModalDialogHandler} from "../ui/core/ModalDialogHandler";
import {LibraryEntry} from "../core/Library";
import {UserInfo} from "./modules/Authentication";


const mutations = {

    auth: {
        authenticated: "auth/authenticated",
        logout: "auth/logout"
    },

    ui: {
        showModal: "ui/showModal",
        hideModal: "ui/hideModal",
    },

    tool: {
        setAvailable: "tool/setAvailable",
        switch: "tool/switch",
        setReferenceObject: "tool/setReferenceObject",
        setKeyPress: "tool/setKeyPress",
        setPreview: "tool/setPreview"
    },

    code: {
        set: "code/setCode",
        add: "code/add",
        insert: "code/insert",
        remove: "code/remove",
        replaceStatement: "code/replaceStatement",
        clearSelection: "code/clearSelection",
        setSelection: "code/setSelection",
        addToSelection: "code/addToSelection",
        renameRegister: "code/renameRegister"
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
        renameField: "data/renameField",
        setFieldValue: "data/setFieldValue",
        setListFieldValue: "data/setListFieldValue",
        addValueToField: "data/addValueToField"
    },

    library: {
        add: "library/add",
        clear: "library/clear"
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
        object: "drawing/object",
        objects: "drawing/objects",
        isObjectSelected: "drawing/isObjectSelected",
        selection: "drawing/selection"
    },

    tool: {
        referenceObject: "tool/referenceObject"
    },

    library: {
        getEntry: "library/getEntry"
    }
}

export class State {
    private readonly _store: Store<AppStore>;
    private readonly _i18n: I18n;

    constructor(store: Store<AppStore>, i18n: I18n) {
        this._store = store;
        this._i18n = i18n;
    }

    get store(): Store<AppStore> {
        return this._store;
    }

    get i18n():I18n {
        return  this._i18n;
    }

    setLocale(locale: string) {
        this._i18n.global.locale = locale;
    }

    get locale():string {
        const locale = this._i18n.global.locale;
        return locale as string;
    }

    protected commit(type: string, payload?: any, options?: CommitOptions) {
        this._store.commit(type, payload, options);
    }

    protected get(type: string, ...params): any {
        if (params.length) {
            return this._store.getters[type](...params);
        } else {
            return this._store.getters[type];
        }
    }

    authenticated(token: string, user: UserInfo) {
        this.commit(mutations.auth.authenticated, { token, user });
    }

    logout() {
        this.commit(mutations.auth.logout);
    }


    get objects(): Array<GrObject> {
        return this.get(getters.drawing.objects);
    }

    getObject(uniqueName: string):GrObject {
        return this.get(getters.drawing.object, uniqueName);
    }

    public setCodeString(code: string) {
        return this.setCode(
            code.split("\n")
                .map(c => c.trim())
                .filter(c => c.length !== 0)
        );
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

    insertStatements(insertAt: number, ...statements: Array<string>) {
        this.commit(mutations.code.insert, { insertAt, statements })
    }

    removeStatement(index: number) {
        this.commit(mutations.code.remove, index);
    }

    setAvailableTools(tools: Array<ToolNames>) {
        this.commit(mutations.tool.setAvailable, tools);
    }

    switchTool(toolName: ToolNames, ...params: Array<any>) {
        if (this._store.state.tool.available.indexOf(toolName) !== -1 || toolName === null) {
            this.commit(mutations.tool.switch, { toolName, params });
        } else {
            console.log(`Tool ${ToolNames[toolName]}(${toolName}) is not available`)
        }
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

    setToolPreview(preview: string) {
        this.commit(mutations.tool.setPreview, preview);
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
        this.commit(mutations.data.setData, fields);
    }

    addDataField(name: string, value: DataFieldValue) {
        this.commit(mutations.data.addField, { name, value });
    }

    addValueToDataField(name: string, value: (number | string)) {
        this.commit(mutations.data.addValueToField, { name, value });
    }

    removeDataField(name: string) {
        this.commit(mutations.data.removeField, name);
    }

    renameDataField(oldName: string, newName: string) {
        this.commit(mutations.data.renameField, { oldName, newName });
        this.commit(mutations.code.renameRegister, { oldName, newName});
    }

    setDateFieldValue(name: string, value: DataFieldValue) {
        this.commit(mutations.data.setFieldValue, { name, value });
    }

    setDataListFieldValue(name: string, index: number, value: DataFieldValue) {
        this.commit(mutations.data.setListFieldValue, { name, index, value });
    }

    showModal(component: any, handler: ModalDialogHandler) {
        this.commit(mutations.ui.showModal, { component, handler });
    }

    hideModal() {
        this.commit(mutations.ui.hideModal);
    }

    addLibraryEntry(entry: LibraryEntry) {
        this.commit(mutations.library.add, entry);
    }

    getLibraryEntry(name: string):LibraryEntry {
        return this.get(getters.library.getEntry, name);
    }

    clearLibrary() {
        this.commit(mutations.library.clear);
    }

}
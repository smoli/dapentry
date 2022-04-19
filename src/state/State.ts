import {CommitOptions, Store} from "vuex";
import {AppStore} from "./AppStore";
import {ToolNames} from "../tools/ToolNames";
import {GrObject} from "../geometry/GrObject";
import {I18n} from "vue-i18n";
import {DataField, DataFieldValue, DataState} from "./modules/Data";
import {AppConfig} from "../core/AppConfig";
import {ModalDialogHandler} from "../ui/core/ModalDialogHandler";
import {LibraryEntry} from "../core/Library";
import {UserInfo} from "./modules/Authentication";
import {LayoutOptions} from "../core/layoutOptions";
import {ASSERT} from "../core/Assertions";
import {AspectRatio} from "../geometry/AspectRatio";
import {ApplicationFeatures} from "../core/AppController";


const mutations = {

    auth: {
        authenticated: "auth/authenticated",
        logout: "auth/logout"
    },

    ui: {
        showModal: "ui/showModal",
        hideModal: "ui/hideModal",
        setLayout: "ui/setLayout",
        toggleLibrary: "ui/toggleLibrary",
        toggleToolbar: "ui/toggleToolbar",
        toggleLeftPanel: "ui/toggleLeftPanel",
        toggleRightPanel: "ui/toggleRightPanel",
        toggleHeader: "ui/toggleHeader",
        toggleToolHints: "ui/toggleToolHints",
        toggleFooter: "ui/toggleFooter",
        setFeatures: "ui/setFeatures"
    },

    tool: {
        reset: "tool/reset",
        setAvailable: "tool/setAvailable",
        switch: "tool/switch",
        setReferenceObject: "tool/setReferenceObject",
        setKeyPress: "tool/setKeyPress",
        setPreview: "tool/setPreview"
    },

    code: {
        restore: "code/restore",
        reset: "code/reset",
        set: "code/setCode",
        add: "code/add",
        insert: "code/insert",
        remove: "code/remove",
        replaceStatement: "code/replaceStatement",
        clearSelection: "code/clearSelection",
        setSelection: "code/setSelection",
        addToSelection: "code/addToSelection",
        renameRegister: "code/renameRegister",
        renameTableColumn: "code/renameTableColumn"
    },

    drawing: {
        restore: "drawing/restore",
        reset: "drawing/reset",
        dimensions: "drawing/setDimensions",
        setGuides: "drawing/setGuides",
        addGuide: "drawing/addGuide",
        removeGuide: "drawing/removeGuide",
        setObjects: "drawing/setObjects",
        selectObject: "drawing/selectObject",
        deselectObject: "drawing/deselectObject",
        deselectAll: "drawing/deselectAll",
        isObjectSelected: "drawing/isObjectSelected",
        setAspectRatio: "drawing/setAspectRatio",
        setPreview: "drawing/setPreview",
        setNameAndDescription: "drawing/setNameAndDescription",
        setId: "drawing/setId",
        setCreatedBy: "drawing/setCreatedBy"
    },

    data: {
        reset: "data/reset",
        setData: "data/setData",
        addField: "data/addField",
        removeField: "data/removeField",
        renameField: "data/renameField",
        setFieldValue: "data/setFieldValue",
        setListFieldValue: "data/setListFieldValue",
        setTableCellValue: "data/setTableCellValue",
        addValueToField: "data/addValueToField",
        removeValueFromListOrTable: "data/removeValueFromListOrTable",
        addColumnToField: "data/addColumnToField",
        renameTableColumn: "data/renameTableColumn",
        removeTableColumn: "data/removeTableColumn",

    },

    library: {
        add: "library/add",
        clear: "library/clear"
    }
}

const getters = {
    code: {
        snapshot: "code/snapshot",
        fullCode: "code/fullCode",
        annotatedSelection: "code/annotatedSelection"
    },

    data: {
        newFieldName: "data/newFieldName",
        dataCode: "data/dataCode",
        dataCodeLength: "data/dataCodeLength"
    },

    drawing: {
        snapshot: "drawing/snapshot",
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
    private _undoStack: Array<Array<{ restore: string, snapshot: any }>>
    private _inTransaction: boolean = false;
    private _transaction: Array<{ type: string, payload?: any, options?: CommitOptions }> = [];

    constructor(store: Store<AppStore>, i18n: I18n) {
        this._store = store;
        this._i18n = i18n;
        this._undoStack = [];
    }

    public transaction(contents: () => void, storeUndo: boolean = true) {
        ASSERT(this._inTransaction === false, "Cannot nest transactions");
        this._inTransaction = true;
        this._transaction = [];
        try {
            contents();
            this._inTransaction = false;
            this.commitTransaction(this._transaction, storeUndo);
        } catch (e) {
            throw e;
        } finally {
            this._inTransaction = false;
            this._transaction = [];
        }
    }

    public undo() {
        if (!this._undoStack.length) {
            return;
        }

        const state = this._undoStack.pop();
        state.forEach(s => {
            this.commit(s.restore, s.snapshot, null, false);
        })
    }

    get store(): Store<AppStore> {
        return this._store;
    }

    get i18n(): I18n {
        return this._i18n;
    }

    setLocale(locale: string) {
        this._i18n.global.locale = locale;
    }

    get locale(): string {
        const locale = this._i18n.global.locale;
        return locale as string;
    }

    protected getSnapShotGetter(mutation: string): string {
        const parts = mutation.split("/");
        return parts[0] + "/" + "snapshot";
    }

    protected getRestoreMutation(mutation: string): string {
        const parts = mutation.split("/");
        return parts[0] + "/" + "restore";
    }

    protected commitTransaction(mutations: Array<{ type: string, payload?: any, options?: CommitOptions }>,
                                storeUndo: boolean = true) {
        if (this._inTransaction) {
            this._transaction.push(...mutations);
        } else {
            if (storeUndo) {
                const undo = mutations.map(m => {
                    return {
                        restore: this.getRestoreMutation(m.type),
                        snapshot: this.get(this.getSnapShotGetter(m.type))
                    }
                });
                this.snapShot(undo);
            }
            mutations.forEach(m => {
                this._store.commit(m.type, m.payload, m.options);
            })
        }
    }

    protected commit(type: string, payload?: any, options?: CommitOptions, storeUndo: boolean = true) {
        if (this._inTransaction) {
            this._transaction.push({ type, payload, options });
        } else {
            if (storeUndo) {
                this.snapShot([{
                        restore: this.getRestoreMutation(type),
                        snapshot: this.get(this.getSnapShotGetter(type))
                    }]
                );
            }
            this._store.commit(type, payload, options);
        }
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

    getObject(uniqueName: string): GrObject {
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
        this.commit(mutations.code.add, code, null);
    }

    replaceStatements(replacements: Array<{ index: number, newStatements: Array<string> }>) {
        this.commitTransaction(replacements.map(r => {
            return {
                type: mutations.code.replaceStatement,
                payload: {
                    index: r.index,
                    newStatements: r.newStatements
                }
            }
        }));
    }

    replaceStatement(index: number, ...newStatements: Array<string>) {
        this.commit(mutations.code.replaceStatement, { index, newStatements })
    }

    wrapStatements(from: number, to: number, before: string, after: string) {
        this.commitTransaction([{
            type: mutations.code.insert,
            payload: { insertAt: from, statements: [before] }
        }, {
            type: mutations.code.insert,
            payload: { insertAt: to + 2, statements: [after] }
        }]);
    }

    insertStatements(insertAt: number, ...statements: Array<string>) {
        this.commit(mutations.code.insert, { insertAt, statements }, null)
    }

    removeStatement(index: number) {
        this.commit(mutations.code.remove, index);
    }

    setAvailableTools(tools: Array<ToolNames>) {
        this.commit(mutations.tool.setAvailable, tools);
    }

    setFeatures(features: ApplicationFeatures) {
        this.commit(mutations.ui.setFeatures, features);
    }

    switchTool(toolName: ToolNames, ...params: Array<any>) {
        if (this._store.state.tool.available.indexOf(toolName) !== -1 || toolName === null) {
            this.commit(mutations.tool.switch, { toolName, params });
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

    private snapShot(undos: Array<{ restore: string, snapshot: any, origin?: string }>) {
        if (undos.find(u => u.snapshot === undefined)) {
            return;
        }
        this._undoStack.push(undos);
    }

    setAspectRatio(ar: AspectRatio) {
        this.commit(mutations.drawing.setAspectRatio, ar, null);
    }

    setDrawingPreview(previewCode: string) {
        this.commit(mutations.drawing.setPreview, previewCode, null, false);
    }

    setDrawingNameAndDescription(name: string, description: string) {
        this.commit(mutations.drawing.setNameAndDescription, { name, description }, null, false)
    }

    setDrawingId(id: number) {
        ASSERT(id !== -1, "-1 is not a valid backend id");
        this.commit(mutations.drawing.setId, id, null, false);
    }

    setDrawingCreatedBy(id: number) {
        this.commit(mutations.drawing.setCreatedBy, id, null, false);
    }

    setDrawingDimensions(width: number, height: number) {
        this.commit(mutations.drawing.dimensions, { width, height }, null, false);
    }

    setObjectsOnDrawing(objects: Array<GrObject>) {
        this.commit(mutations.drawing.setObjects, objects, null, false);
    }

    addGuide(name: string) {
        this.commit(mutations.drawing.addGuide, name);
    }

    removeGuide(name: string) {
        this.commit(mutations.drawing.removeGuide, name);
    }

    setGuides(guideNames: Array<string>) {
        this.commit(mutations.drawing.setGuides, guideNames);
    }

    selectObject(object: GrObject) {
        this.commit(mutations.drawing.selectObject, object, null, false);
    }

    deselectObject(object: GrObject) {
        this.commit(mutations.drawing.deselectObject, object, null, false);
    }

    deselectAll() {
        this.commit(mutations.drawing.deselectAll, null, null, false);
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

    addDataField(name: string, value: DataFieldValue, description: string = null, published: boolean = true) {
        this.commit(mutations.data.addField, { name, value, description, published }, null);
    }

    addValueToDataField(name: string, value: ( number | string )) {
        this.commit(mutations.data.addValueToField, { name, value });
    }

    removeValueFromListOrTable(name: string, index: number) {
        this.commit(mutations.data.removeValueFromListOrTable, { name, index });
    }

    addColumnToDataField(name: string, value: ( number | string )) {
        this.commit(mutations.data.addColumnToField, { name, value });
    }

    renameTableColumn(name: string, oldColumn: string, newColumn: string) {
        this.commitTransaction([
            {
                type: mutations.data.renameTableColumn,
                payload: { name, oldColumn, newColumn }
            },
            {
                type: mutations.code.renameTableColumn,
                payload: { name, oldColumn, newColumn }
            }
        ]);
    }

    removeTableColumn(name: string, column: string) {
        this.commit(mutations.data.removeTableColumn, { name, column });
    }

    removeDataField(name: string) {
        this.commit(mutations.data.removeField, name);
    }

    renameDataField(oldName: string, newName: string) {
        this.commitTransaction([
            {
                type: mutations.data.renameField,
                payload: { oldName, newName }
            },
            {
                type: mutations.code.renameRegister,
                payload: { oldName, newName }
            }
        ]);
    }

    renameRegister(oldName: string, newName: string) {
        this.commit(mutations.code.renameRegister, { oldName, newName });
    }

    setDataFieldValue(name: string, value: DataFieldValue) {
        this.commit(mutations.data.setFieldValue, { name, value });
    }

    setDataListFieldValue(name: string, index: number, value: DataFieldValue) {
        this.commit(mutations.data.setListFieldValue, { name, index, value });
    }

    public setDataTableCellValue(name: string, index: number, column: string, value: DataFieldValue) {
        this.commit(mutations.data.setTableCellValue, { name, index, column, value });
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

    getLibraryEntry(name: string): LibraryEntry {
        return this.get(getters.library.getEntry, name);
    }

    clearLibrary() {
        this.commit(mutations.library.clear);
    }


    resetAll() {
        this._undoStack = [];
        this.commit(mutations.drawing.reset);
        this.commit(mutations.code.reset);
        this.commit(mutations.tool.reset);
        this.commit(mutations.data.reset);
    }

    setLayout(layout: LayoutOptions) {
        this.commit(mutations.ui.setLayout, layout);
    }

    toggleLibrary() {
        this.commit(mutations.ui.toggleLibrary);
    }

    toggleToolbar() {
        this.commit(mutations.ui.toggleToolbar);
    }

    public toggleLeftPanel() {
        this.commit(mutations.ui.toggleLeftPanel);
    }

    public toggleRightPanel() {
        this.commit(mutations.ui.toggleRightPanel);
    }

    public toggleHeader() {
        this.commit(mutations.ui.toggleHeader);
    }

    public toggleToolHints() {
        this.commit(mutations.ui.toggleToolHints);
    }

    public toggleFooter() {
        this.commit(mutations.ui.toggleFooter);
    }

}
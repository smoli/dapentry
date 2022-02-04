import {AppModel, AppModelKeys} from "./AppModel";
import {SegmentedCodeLine} from "../../src/SegmentedCodeLine";
import {GrObject} from "../../src/geometry/GrObject";
import {Style} from "../../src/drawing/StyleManager";
import {AbsStatePersistence} from "./AbsStatePersistence";
import {LibraryEntry} from "../../src/Library";
import {Parser} from "../../src/runtime/interpreter/Parser";

export interface SelectionInfo {
    name: string,
    style: Style,
    object: GrObject,
    type: string
}

export interface DataFieldInfo {
    name: string,
    value: any
}

export  class AppState {
    private _appModel: AppModel;
    private _persistence: AbsStatePersistence;

    constructor(appModel: AppModel, persistence: AbsStatePersistence) {
        this._appModel = appModel;
        this._persistence = persistence;
    }

    public async loadFromPersistence() {
        const library = await this._persistence.getLibraryEntries();
        for (const e of library) {
            this._appModel.addLibraryEntry(e);
        }

        const dataFields = await this._persistence.getDataFields();

        for (const f of dataFields) {
            this._appModel.addDataField(f);
        }
    }

    get fullCode():Array<string> {
        return this._appModel.fullCode;
    }

    getSegmentedCode():Array<SegmentedCodeLine> {
        return this._appModel.getSegmentedCode();
    }

    deleteSelection() {
        return this._appModel.deleteSelection();
    }

    insertStatement(code: string, atIndex:number) {
        return this._appModel.insertStatement(code, atIndex);
    }

    addStatement(code: string) {
        return this._appModel.addStatement(code);
    }

    insertStatements(code: Array<string>, atIndex:number) {
        return this._appModel.insertStatements(code, atIndex);
    }

    addStatements(code: Array<string>) {
        return this._appModel.addStatements(code);
    }

    replaceCode(code: Array<string>) {
        return this._appModel.replaceCode(code);
    }

    replaceStatement(indexToReplace: number, newStatements: (string | Array<string>)) {
        return this._appModel.replaceStatement(indexToReplace, newStatements);
    }

    setSelectedObjects(objects: Array<GrObject>) {
        return this._appModel.setSelectedObjects(objects);
    }

    getSelectedObjects():Array<SelectionInfo> {
        return this._appModel.getSelectedObjects();
    }

    getSelectedCodeLines(): Array<SegmentedCodeLine> {
        return this._appModel.getSelectedCodeLines();
    }

    getLastSelectedCodeLineIndex(): number {
        return this._appModel.getLastSelectedCodeLineIndex();
    }

    setSelectedCodeLines(indexes: Array<number>) {
        return this._appModel.setSelectedCodeLines(indexes);
    }

    setOperationPreview(code:string) {
        return this._appModel.setOperationPreview(code);
    }

    clearOperationPreview() {
        return this._appModel.clearOperationPreview();
    }

    get editableCodeLine():SegmentedCodeLine {
        return this._appModel.editableCodeLine;
    }

    getSegmentedCodeLine(index: number): SegmentedCodeLine {
        return this._appModel.getSegmentedCodeLine(index);
    }


    public get scopeCodeLength(): number {
        return this._appModel.scopeCodeLength;
    }

    public get data() {
        return this._appModel.data;
    }

    public addDataField(fieldInfo:DataFieldInfo) {
        return this._appModel.addDataField(fieldInfo);
    }

    public removeFieldFromData(name: string) {
        return this._appModel.removeFieldFromData(name);
    }

    public getDataField(name:string): DataFieldInfo {
        return this._appModel.getDataField(name);
    }

    public addLibraryEntry(info: LibraryEntry) {
        return this._appModel.addLibraryEntry(info);
    }

    public getLibraryEntry(id: string): LibraryEntry {
        return this._appModel.getLibraryEntry(id);
    }

    public setToolHint(hint:string) {
        return this._appModel.setToolHint(hint);
    }

    public clearToolHint() {
        return this._appModel.clearToolHint();
    }

}
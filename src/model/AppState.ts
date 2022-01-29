import {AppModel} from "./AppModel";
import {SegmentedCodeLine} from "../SegmentedCodeLine";
import {GrObject} from "../Geo/GrObject";
import {Style} from "../controls/drawing/Objects/StyleManager";

export interface SelectionInfo {
    name: string,
    style: Style,
    object: GrObject,
    type: string
}

export  class AppState {
    private _appModel: AppModel;
    
    constructor(appModel: AppModel) {
        this._appModel = appModel;
    }

    get appModelName():string {
        return this._appModel.modelName;
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

    public addDataField(fieldInfo) {
        return this._appModel.addDataField(fieldInfo);
    }

    public removeFieldFromData(name: string) {
        return this._appModel.removeFieldFromData(name);
    }

    public getDataField(name:string): any {
        return this._appModel.getDataField(name);
    }

}
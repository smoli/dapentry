import {JSONModelAccess} from "../JSONModelAccess";
import {CodeManager} from "../../src/runtime/CodeManager";
import {Parser} from "../../src/runtime/interpreter/Parser";
import JSONModel from "sap/ui/model/json/JSONModel";
import {GrObject, ObjectType} from "../../src/geometry/GrObject";
import {SegmentedCodeLine} from "../../src/core/SegmentedCodeLine";
import {DataFieldInfo, SelectionInfo} from "./AppState";
import {LibraryEntry} from "../../src/core/Library";


export enum AppModelKeys {
    codeString = "codeString",
    segmentedCode = "segmentedCode",
    selectedCode = "selectedCode",
    editableCodeLine = "editableCodeLine",
    data = "data",
    drawing = "drawing",
    selectedObjects = "selectedObjects",
    codeEditor = "codeEditor",
    codeEditorSize = "codeEditorSize",
    styleEditor = "styleEditor",
    structureEditor = "structureEditor",
    dataEditorSize = "dataEditorSize",
    library = "library",
    rightPanel = "rightPanel",
    toolHint = "toolHint"
}

export class AppModel extends JSONModelAccess {

    private readonly _codeManager: CodeManager;

    constructor(model:JSONModel) {

        model.setData({
            [AppModelKeys.codeString]: "",
            [AppModelKeys.segmentedCode]: [],
            [AppModelKeys.selectedCode]: [],
            [AppModelKeys.editableCodeLine]: null,
            [AppModelKeys.data]: [],
            [AppModelKeys.drawing]: [],
            [AppModelKeys.selectedObjects]: [],
            [AppModelKeys.codeEditor]: false,
            [AppModelKeys.styleEditor]: false,
            [AppModelKeys.structureEditor]: true,
            [AppModelKeys.codeEditorSize]: "20%",
            [AppModelKeys.dataEditorSize]: "20%",
            [AppModelKeys.library]: [],
            [AppModelKeys.rightPanel]: "none",
            [AppModelKeys.toolHint]: null
        });

        super(model);

        this._codeManager = new CodeManager({
            LOAD: 1,
            ADD: 1,
            SUB: 1,
            CIRCLE: 1,
            RECT: 1
        });
        this._codeManager.clear();
    }

    get codeManager(): CodeManager {
        return this._codeManager;
    }

    get fullCode():Array<string> {
        return [...this.createScopeCodeFromData(), ...this.codeManager.code];
    }

    protected updateSegmentedCode() {
        this.set(AppModelKeys.segmentedCode)
            .to(
                this._codeManager.annotatedCode
                    .map(c => {
                        return {
                            index: c.originalLine,
                            code: c.code,
                            tokens: Parser.parseLine(c.code),
                            level: c.level,
                            selected: false
                        }
                    })
            );
    }

    protected updateCodeString() {
        this.set(AppModelKeys.codeString).to(this._codeManager.code.join("\n"));
    }

    getSegmentedCode():Array<SegmentedCodeLine> {
        return this.get(AppModelKeys.segmentedCode);
    }

    deleteSelection() {
        const sel:Array<SelectionInfo> = this.getSelectedObjects();
        for (const obj of sel) {
            const r = obj.object.name;
            this.codeManager.removeStatementsForRegister(r);
        }
        this.updateSegmentedCode();
        this.updateCodeString();
    }

    insertStatement(code: string, atIndex:number) {
        this.codeManager.insertStatement(code, atIndex);
        this.updateSegmentedCode();
        this.updateCodeString();
    }

    addStatement(code: string) {
        this.codeManager.addStatement(code);
        this.updateSegmentedCode();
        this.updateCodeString();
    }

    insertStatements(code: Array<string>, atIndex:number) {
        let index = atIndex;
        code.forEach(c => this.codeManager.insertStatement(c, index++));
        this.updateSegmentedCode();
        this.updateCodeString();
    }

    addStatements(code: Array<string>) {
        code.forEach(c => this.codeManager.addStatement(c));
        this.updateSegmentedCode();
        this.updateCodeString();
    }

    replaceCode(code: Array<string>) {
        this._codeManager.clear();
        code.forEach(c => this.codeManager.addStatement(c));
        this.updateSegmentedCode();
        this.updateCodeString();
    }

    replaceStatement(indexToReplace: number, newStatements: (string | Array<string>)) {
        let first;
        if (Array.isArray(newStatements)) {
            first = newStatements[0]
        } else {
            first = newStatements;
        }

        this._codeManager.updateStatement(indexToReplace, first);
        if (Array.isArray(newStatements)) {

            for (let i = 1; i < newStatements.length; i++) {
                this._codeManager.insertStatement(newStatements[i], indexToReplace + i)
            }
        }
        this.updateSegmentedCode();
        this.updateCodeString();
    }

    setSelectedObjects(objects: Array<GrObject>) {
        let s = [];
        if (objects) {

            s = objects.map(object => {
                return {
                    "name": object.uniqueName,
                    "type": ObjectType[object.type],
                    "style": {...object.style},
                    object
                }
            });
        }

        this.set(AppModelKeys.selectedObjects).to(s);
    }

    getSelectedObjects():Array<SelectionInfo> {
        return this.get(AppModelKeys.selectedObjects);
    }

    getSelectedCodeLines(): Array<SegmentedCodeLine> {
        return this.get(AppModelKeys.selectedCode);
    }

    getLastSelectedCodeLineIndex(): number {
        const selection = this.getSelectedCodeLines()
        if (selection && selection.length) {
            return Math.max(...selection.map(s => s.index));
        } else {
            return -1;
        }
    }

    setSelectedCodeLines(indexes: Array<number>) {
        let lines = this.getSelectedCodeLines();
        lines.forEach(sc => {
                this.set(AppModelKeys.segmentedCode, c => c.index === sc.index, "selected").to(false);
            });

        lines = indexes.map(i => this.getSegmentedCodeLine(i));
        lines.forEach(sc => {
            this.set(AppModelKeys.segmentedCode, c => c.index === sc.index, "selected").to(true);
        });

        this.set(AppModelKeys.selectedCode).to(lines);

        if (indexes.length) {
            const last = this.get(AppModelKeys.selectedCode, c => c.index === Math.max(...indexes));
            this.set(AppModelKeys.editableCodeLine).to(last);
        } else {
            this.set(AppModelKeys.editableCodeLine).to(null);
        }
    }

    setOperationPreview(code:string) {
        const s = {
            index: -1,
            code: code,
            tokens: Parser.parseLine(code),
            level: 0,
            selected: false
        }

        this.set(AppModelKeys.editableCodeLine).to(s);
    }

    clearOperationPreview() {
        this.set(AppModelKeys.editableCodeLine).to(null);
    }

    get editableCodeLine():SegmentedCodeLine {
        return this.get(AppModelKeys.editableCodeLine);
    }

    getSegmentedCodeLine(index: number): SegmentedCodeLine {
        return this.get(AppModelKeys.segmentedCode, c => c.index === index);
    }


    protected createScopeCodeFromData() {
        const d:Array<DataFieldInfo> = this.get(AppModelKeys.data);
        const code = [];

        const encValue = (value) => {
            if (Array.isArray(value)) {
                return `[${value.map(encValue).join(",")}]`;
            } else if (typeof value === "string") {
                return `"${value}"`;
            } else {
                return `${value}`;
            }
        }

        for (const field of d) {
            code.push(`LOAD ${field.name}, ${encValue(field.value)}`)
        }

        return code;
    }

    public get scopeCodeLength(): number {
        return Object.keys(this.get(AppModelKeys.data)).length;
    }

    get data():any {
        return this.get(AppModelKeys.data);
    }

    public addDataField(fieldInfo: DataFieldInfo) {
        this.push(fieldInfo).to(AppModelKeys.data);
    }

    public removeFieldFromData(name: string) {
        this.remove(d => d.name === name).from(AppModelKeys.data);
    }

    public getDataField(name:string): DataFieldInfo {
        return this.get("data", d => d.name === name);
    }

    public addLibraryEntry(info: LibraryEntry) {
        if (this.get(AppModelKeys.library, e => e.id === info.id)) {
            this.remove(e => e.name === info.id).from(AppModelKeys.library);
        }
        this.push(info).to(AppModelKeys.library);
    }

    public getLibraryEntry(id: string): LibraryEntry {
        return this.get(AppModelKeys.library, e => e.id === id);
    }

    public setToolHint(hint:string) {
        this.set(AppModelKeys.toolHint).to(hint);
    }

    public clearToolHint() {
        this.set(AppModelKeys.toolHint).to(null);
    }
}

import {JSONModelAccess} from "../JSONModelAccess";
import {CodeManager} from "../runtime/CodeManager";
import {Parser} from "../runtime/interpreter/Parser";
import JSONModel from "sap/ui/model/json/JSONModel";
import {GrObject, ObjectType} from "../Geo/GrObject";
import {SegmentedCodeLine} from "../SegmentedCodeLine";
import {SelectionInfo} from "./AppState";


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
    rightPanel = "rightPanel"
}

export class AppModel extends JSONModelAccess {

    private readonly _codeManager: CodeManager;

    constructor(codeManager: CodeManager) {

        const model = new JSONModel({
            [AppModelKeys.codeString]: "",
            [AppModelKeys.segmentedCode]: [],
            [AppModelKeys.selectedCode]: [],
            [AppModelKeys.editableCodeLine]: null,
            [AppModelKeys.data]: [ { name: "f1", value: [10, 20, 30, 40] }, { name: "f2", value: 5 }],
            [AppModelKeys.drawing]: [],
            [AppModelKeys.selectedObjects]: [],
            [AppModelKeys.codeEditor]: false,
            [AppModelKeys.styleEditor]: false,
            [AppModelKeys.structureEditor]: true,
            [AppModelKeys.codeEditorSize]: "20%",
            [AppModelKeys.dataEditorSize]: "20%",
            [AppModelKeys.library]: [],
            [AppModelKeys.rightPanel]: "none"
        });

        super(model);
        this._codeManager = codeManager;
        this._codeManager.clear();
    }

    get modelName():string {
        return "appModel";
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

    get editableCodeLine():SegmentedCodeLine {
        return this.get(AppModelKeys.editableCodeLine);
    }

    getSegmentedCodeLine(index: number): SegmentedCodeLine {
        return this.get(AppModelKeys.segmentedCode, c => c.index === index);
    }


    protected createScopeCodeFromData() {
        const d = this.get(AppModelKeys.data);
        const code = [];
        for (const field of d) {
            if (Array.isArray(field.value)) {
                code.push(`LOAD ${field.name}, [${field.value}]`)

            } else {
                code.push(`LOAD ${field.name}, ${field.value}`)
            }
        }

        return code;
    }

    public get scopeCodeLength(): number {
        return Object.keys(this.get(AppModelKeys.data)).length;
    }

    get data():any {
        return this.get(AppModelKeys.data);
    }

    public addDataField(fieldInfo) {
        this.push(fieldInfo).to(AppModelKeys.data);
    }

    public removeFieldFromData(name) {
        this.remove(d => d.name === name).from(AppModelKeys.data);
    }

    public getDataField(name:string) {
        return this.get("data", d => d.name === name);
    }
}

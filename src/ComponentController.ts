import Component from "./Component";
import JSONModel from "sap/ui/model/json/JSONModel";
import {Interpreter} from "./runtime/interpreter/Interpreter";
import {GfxCircle} from "./runtime/gfx/GfxCircle";
import {GfxRect} from "./runtime/gfx/GfxRect";
import {GfxMove} from "./runtime/gfx/GfxMove";
import {Parser} from "./runtime/interpreter/Parser";
import {StyleManager} from "./controls/drawing/Objects/StyleManager";
import {GfxFill} from "./runtime/gfx/GfxFill";
import {GrObject, ObjectType} from "./controls/drawing/Objects/GrObject";
import Drawing from "./controls/drawing/Drawing";
import {GfxLine} from "./runtime/gfx/GfxLine";
import {GfxStroke} from "./runtime/gfx/GfxStroke";
import {GfxRotate} from "./runtime/gfx/GfxRotate";

export class ComponentController {
    private _component: Component;
    private _interpreter: Interpreter;
    private _styleManager: StyleManager;
    private _drawing: Drawing;

    constructor(component: Component) {
        this._component = component;
        this._styleManager = new StyleManager();
        this._interpreter = new Interpreter();

        this._interpreter.addOperation("CIRCLE", GfxCircle);
        this._interpreter.addOperation("RECT", GfxRect);
        this._interpreter.addOperation("LINE", GfxLine);
        this._interpreter.addOperation("MOVE", GfxMove);
        this._interpreter.addOperation("ROTATE", GfxRotate);
        this._interpreter.addOperation("FILL", GfxFill);
        this._interpreter.addOperation("STROKE", GfxStroke);

        const appModel = new JSONModel({
            code: [],
            segmentedCode: [],
            selectedCodeLine: null,
            data: [],
            drawing: [],
            poi: [],
            selection: []
        });
        component.setModel(appModel, "appModel");
        // this.preloadDemoCode();
    }

    public setSelectedCodeLine(line?) {
        if (!line) {
            this.getAppModel().setProperty("/selectedCodeLine", null);
        } else {
            this.getAppModel().setProperty("/selectedCodeLine", line);
        }
    }

    protected getDataFromDataFields() {
        const scope = {};
        const d = this.getAppModel().getProperty("/data");

        for (const field of d) {
            scope[field.name] = field.value;
        }

        return scope;
    }


    protected async runCode(): Promise<any> {
        const c = this.getAppModel().getProperty("/code");

        const data = this.getDataFromDataFields();
        this._interpreter.parse(c);
        return this._interpreter.run({
            "$drawing": this.getAppModel().getProperty("/drawing"),
            "$styles": this._styleManager.styles,
            ...data
        });
    }

    getAppModel(): JSONModel {
        return this._component.getModel("appModel") as JSONModel;
    }

    private addCodeLineToSegmentedCode(index: number, codeLine: string): void {
        const tokens = Parser.parseLine(codeLine);
        const c = this.getAppModel().getProperty("/segmentedCode");
        c.push({
            index,
            tokens
        });
        this.getAppModel().setProperty("/segmentedCode", c);
    }

    private addCodeLine(codeLine: string): void {
        const c = this.getAppModel().getProperty("/code");
        c.push(codeLine);
        this.getAppModel().setProperty("/code", c);
        this.addCodeLineToSegmentedCode(c.length - 1, codeLine);
    }

    protected updateSegmentedCodeLine(index:number, codeLine:string) {
        const tokens = Parser.parseLine(codeLine);
        const c = this.getAppModel().getProperty("/segmentedCode");
        c[index].tokens = tokens;
        this.getAppModel().setProperty("/segmentedCode", c);
    }

    async updateOperation(index:number, code:string) {
        const c = this.getAppModel().getProperty("/code");
        c[index] = code;
        this.getAppModel().setProperty("/code", c);
        this.updateSegmentedCodeLine(index, code);
        await this.runCode();
        this.updateDrawing();
    }

    async addOperation(code: string) {
        this.addCodeLine(code);
        await this.runCode();
        this.updateDrawing();
    }

    async addOperations(code: Array<string>) {
        code.forEach(c => this.addCodeLine(c));
        if (this._drawing) {
            await this.runCode();
            this.updateDrawing();
        }
    }

    /**
     * TODO: This is hacky
     * @param clearAllFirst
     * @protected
     */
    protected updateDrawing(clearAllFirst: boolean = false) {
        this._drawing.update(clearAllFirst);
    }

    public updateAll() {
        this.runCode().then(() => {
            this.updateDrawing();
        });
    }

    /**
     * TODO: this is hacky. We need to figure out a way to make the drawing control
     *       actually data driven.
     * @param value
     */
    public set drawing(value: Drawing) {
        this._drawing = value;
        this.runCode().then(() => {
            this.updateDrawing();
        });
    }

    getSelection(): Array<GrObject> {
        return this.getAppModel().getProperty("/selection");
    }

    setSelection(selection: Array<GrObject>) {
        let s = [];
        if (selection) {

            s = selection.map(object => {
                return {
                    "name": object.name,
                    "type": ObjectType[object.type],
                    "style": {...object.style},
                    object
                }
            });
        }

        this.getAppModel().setProperty("/selection", s);
    }

    protected preloadDemoCode(): void {
        const code = `RECT $drawing Rectangle1 "Rectangle1" $styles.default (663 381) 406 322
FILL Rectangle1 "#52fff3" 1
MOVE Rectangle1 "top" (-83 13)
MOVE Rectangle1 "left" (-214 -8)
CIRCLE $drawing Circle2 "Circle2" $styles.default (678 395) 85.38149682454625
STROKE Circle2 12
FILL Circle2 "#ff52ff" 1
CIRCLE $drawing Circle3 "Circle3" $styles.default (395 164) 54.57105459856901
FILL Circle3 "#ff7a52" 1
FILL Circle3 "#fff352" 1
CIRCLE $drawing Circle5 "Circle5" $styles.default (417 637) 69.35416353759881
FILL Circle5 "#52ffe8" 1
CIRCLE $drawing Circle6 "Circle6" $styles.default (66 385) 62
FILL Circle6 "#54ff52" 1
CIRCLE $drawing Circle8 "Circle8" $styles.default (491 373) 49.040799340956916
CIRCLE $drawing Circle9 "Circle9" $styles.default (449 415) 37.20215047547655
CIRCLE $drawing Circle10 "Circle10" $styles.default (290 410) 97.06183596038146
CIRCLE $drawing Circle11 "Circle11" $styles.default (483 306) 43.18564576337837
FILL Circle10 "#526fff" 1
FILL Circle8 "#ab52ff" 1
LINE $drawing Line13 "Line13" $styles.default (373 307) (415 445)
STROKE Line13 24
FILL Line13 "#525dff" 1
FILL Line13 "#646de8" 1
FILL Line13 "#191b2e" 1
FILL Line13 "#dadae2" 1
FILL Line13 "#969ad4" 1
FILL Line13 "#9297d3" 1
FILL Line13 "#989de7" 1
FILL Line13 "#6a72e2" 1
FILL Circle11 "#86ff52" 1
FILL Circle11 "#3d4738" 1
FILL Circle11 "#687463" 1
FILL Circle11 "#4f6944" 1
FILL Circle11 "#537a43" 1
FILL Circle11 "#56973b" 1
FILL Circle9 "#d7d6d5" 1
FILL Circle9 "#d7d5d7" 1
FILL Circle9 "#ae6b9f" 1
FILL Circle9 "#751f62" 1
FILL Circle9 "#3a0d30" 1
FILL Circle9 "#792066" 1`;

        this.addOperations(code.split("\n").filter(l => !!l));
    }

}
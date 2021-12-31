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
        this.preloadDemoCode();
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
        const code = `RECT $drawing Rectangle1 "Rectangle1" $styles.default (151.5 568) 111 110
ROTATE Rectangle1 0.4855458300081347
ROTATE Rectangle1 0.4855458300081347
ROTATE Rectangle1 41.89397290438357
FILL Rectangle1 "#ff5d52" 1
FILL Rectangle1 "#ff8e52" 1
FILL Rectangle1 "#ff6952" 1
FILL Rectangle1 "#f42a0b" 1
RECT $drawing Rectangle2 "Rectangle2" $styles.default (374 634) 120 118
FILL Rectangle2 "#ffba52" 1
FILL Rectangle2 "#ffb452" 1
FILL Rectangle2 "#f49110" 1
FILL Rectangle2 "#f48a10" 1
FILL Rectangle2 "#f4d910" 1
FILL Rectangle2 "#f4a010" 1
FILL Rectangle2 "#f4ce10" 1
FILL Rectangle2 "#f4a410" 1
ROTATE Rectangle2 39.207203504967836
FILL Rectangle2 "#f0f410" 1
MOVE Rectangle2 "center" (-59 -78)
RECT $drawing Rectangle3 "Rectangle3" $styles.default (537 605.5) 122 117
FILL Rectangle3 "#52ff66" 1
FILL Rectangle3 "#25f83e" 1
ROTATE Rectangle3 42.90984084628932
MOVE Rectangle3 "center" (-54 -59)
RECT $drawing Rectangle4 "Rectangle4" $styles.default (681.5 739) 127 122
FILL Rectangle4 "#52d7ff" 1
FILL Rectangle4 "#46b6d8" 1
FILL Rectangle4 "#45c6ed" 1
ROTATE Rectangle4 43.667780146130355
MOVE Rectangle4 "center" (-21 -122)
ROTATE Rectangle4 31.345214141715672
MOVE Rectangle4 "center" (-4 -93)
CIRCLE $drawing Circle5 "Circle5" $styles.default (787 469) 97.20082304178294
FILL Circle5 "#ff52eb" 1
CIRCLE $drawing Circle6 "Circle6" $styles.default (792 522) 20
FILL Circle6 "#070403" 1
FILL Circle6 "#311e17" 1
CIRCLE $drawing Circle7 "Circle7" $styles.default (751 427) 12.806248474865697
CIRCLE $drawing Circle8 "Circle8" $styles.default (824 431) 13.601470508735444
FILL Circle7 "#5252ff" 1
FILL Circle7 "#1616df" 1
FILL Circle8 "#525dff" 1
FILL Circle8 "#222ed3" 1
FILL Circle8 "#0e1dec" 1
RECT $drawing Rectangle9 "Rectangle9" $styles.default (470.5 174.5) 919 57
FILL Rectangle9 "#742b11" 1
LINE $drawing Line11 "Line11" $styles.default (92 299) (189 333)
MOVE Line11 "end" (1 -7)
ROTATE Line11 -17.17545145318105
FILL Line11 "#f1d1c5" 1
FILL Line11 "#e9b39f" 1
FILL Line11 "#e3a087" 1
LINE $drawing Line12 "Line12" $styles.default (286 348) (400 352)
LINE $drawing Line13 "Line13" $styles.default (469 286) (600 285)
LINE $drawing Line14 "Line14" $styles.default (568 382) (678 382)
STROKE Line11 10
STROKE Line11 6
FILL Line12 "#e4b2a0" 1
FILL Line12 "#d09680" 1
STROKE Line12 6
FILL Line13 "#daa490" 1
STROKE Line13 6
STROKE Line14 6
FILL Line14 "#e49f86" 1
CIRCLE $drawing Circle16 "Circle16" $styles.default (75 746) 12.083045973594572
CIRCLE $drawing Circle17 "Circle17" $styles.default (96 753) 13.601470508735444
CIRCLE $drawing Circle18 "Circle18" $styles.default (118 746) 12.806248474865697
CIRCLE $drawing Circle19 "Circle19" $styles.default (144 742) 13.45362404707371
FILL Circle16 "#52fcff" 1
FILL Circle17 "#52f6ff" 1
FILL Circle18 "#52fffc" 1
FILL Circle19 "#52fcff" 1`;

        this.addOperations(code.split("\n").filter(l => !!l));
    }

}
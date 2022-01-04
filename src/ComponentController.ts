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
import {GfxPolygon} from "./runtime/gfx/GfxPolygon";
import {GfxOperation} from "./runtime/gfx/GfxOperation";
import {GfxQuadratic} from "./runtime/gfx/GfxQuadratic";
import {Operation} from "./runtime/interpreter/Operation";
import {CodeManager} from "./runtime/CodeManager";
import {BaseComponentController} from "./BaseComponentController";


/**
 * Creates a operation class that calls a callback for the grObject
 * created/manipulated.
 *
 * TODO: I obviously haven't understood the typing properly, as I expected
 *       OpClass: (typeof GfxOperation) to work. But it didn't :-(
 *
 * @param OpClass
 * @param objectCallBack
 */
function makeGfxOperation(OpClass: (typeof Operation), objectCallBack: (GrObject) => void) {
    return class C extends OpClass {
        async execute(interpreter: Interpreter): Promise<any> {
            const r = super.execute(interpreter);
            objectCallBack((this as unknown as GfxOperation).target);
            return r;
        }
    }
}

export class ComponentController extends BaseComponentController {
    private _component: Component;
    private _interpreter: Interpreter;
    private _styleManager: StyleManager;
    private _codeManager: CodeManager;
    private _drawing: Drawing;
    private _lastTouchedObjectByProgram: GrObject;

    constructor(component: Component) {
        super();

        this._component = component;
        this._styleManager = new StyleManager();
        this._interpreter = new Interpreter();

        this._interpreter.addOperation("CIRCLE", makeGfxOperation(GfxCircle, this.lastTouchedObjectByProgram.bind(this)));
        this._interpreter.addOperation("RECT", makeGfxOperation(GfxRect, this.lastTouchedObjectByProgram.bind(this)));
        this._interpreter.addOperation("LINE", makeGfxOperation(GfxLine, this.lastTouchedObjectByProgram.bind(this)));
        this._interpreter.addOperation("POLY", makeGfxOperation(GfxPolygon, this.lastTouchedObjectByProgram.bind(this)));
        this._interpreter.addOperation("QUAD", makeGfxOperation(GfxQuadratic, this.lastTouchedObjectByProgram.bind(this)));
        this._interpreter.addOperation("MOVE", makeGfxOperation(GfxMove, this.lastTouchedObjectByProgram.bind(this)));
        this._interpreter.addOperation("ROTATE", makeGfxOperation(GfxRotate, this.lastTouchedObjectByProgram.bind(this)));
        this._interpreter.addOperation("FILL", makeGfxOperation(GfxFill, this.lastTouchedObjectByProgram.bind(this)));
        this._interpreter.addOperation("STROKE", makeGfxOperation(GfxStroke, this.lastTouchedObjectByProgram.bind(this)));

        this._codeManager = new CodeManager();

        const appModel = new JSONModel({
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

    protected lastTouchedObjectByProgram(object:GrObject) {
        this._lastTouchedObjectByProgram = object;
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
        const data = this.getDataFromDataFields();
        this._interpreter.parse(this._codeManager.code);
        return this._interpreter.run({
            "$drawing": this.getAppModel().getProperty("/drawing"),
            "$styles": this._styleManager.styles,
            "$lastObject": null,
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
        this._codeManager.addStatement(codeLine);
        this.addCodeLineToSegmentedCode(this._codeManager.code.length - 1, codeLine);
    }

    protected updateSegmentedCodeLine(index:number, codeLine:string) {
        const tokens = Parser.parseLine(codeLine);
        const c = this.getAppModel().getProperty("/segmentedCode");
        c[index].tokens = tokens;
        this.getAppModel().setProperty("/segmentedCode", c);
    }

    async updateOperation(index:number, code:string) {
        this._codeManager.updateStatement(index, code);
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
            if (this._lastTouchedObjectByProgram) {
                this._drawing.selectObject(this._lastTouchedObjectByProgram);
            }
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
        const code = `LINE $drawing Line1 "Line1" $styles.default (2 439) (795 10)
LINE $drawing Line2 "Line2" $styles.default (937 54) (11 566)
LINE $drawing Line3 "Line3" $styles.default (12 554) (5 433)
POLY $drawing Polygon4 "Polygon4" $styles.default [ (6 435) (801 8) (801 8) (939 54) (8 564) (8 429) (8 429) ] 1
FILL Polygon4 "#ffffff" 1
FILL Polygon4 "#f6d59d" 1
CIRCLE $drawing Circle5 "Circle5" $styles.default (65 450) 18.973665961010276
CIRCLE $drawing Circle6 "Circle6" $styles.default (143 423) 18.439088914585774
CIRCLE $drawing Circle7 "Circle7" $styles.default (211 392) 18.973665961010276
CIRCLE $drawing Circle8 "Circle8" $styles.default (283 352) 21.095023109728988
CIRCLE $drawing Circle9 "Circle9" $styles.default (352 307) 19
CIRCLE $drawing Circle10 "Circle10" $styles.default (419 274) 17.11724276862369
CIRCLE $drawing Circle11 "Circle11" $styles.default (495 235) 16
CIRCLE $drawing Circle12 "Circle12" $styles.default (556 199) 19
CIRCLE $drawing Circle13 "Circle13" $styles.default (624 160) 19.235384061671343
CIRCLE $drawing Circle14 "Circle14" $styles.default (690 116) 18.027756377319946
CIRCLE $drawing Circle15 "Circle15" $styles.default (778 75) 30.083217912982647
FILL Circle5 "#52eeff" 1
FILL Circle5 "#85eefa" 1
FILL Circle6 "#52ebff" 1
FILL Circle6 "#87eaf7" 1
FILL Circle7 "#52fcff" 1
FILL Circle7 "#92f5f6" 1
FILL Circle8 "#52ffff" 1
FILL Circle8 "#79f6f6" 1
FILL Circle9 "#52fffc" 1
FILL Circle9 "#8ff5f3" 1
FILL Circle10 "#52f3ff" 1
FILL Circle10 "#80edf5" 1
FILL Circle11 "#52ffff" 1
FILL Circle11 "#9cf7f7" 1
FILL Circle12 "#52ffff" 1
FILL Circle12 "#7af0f0" 1
FILL Circle13 "#52ffff" 1
FILL Circle13 "#7febeb" 1
FILL Circle14 "#52eeff" 1
FILL Circle14 "#a4ecf4" 1
FILL Circle15 "#52f6ff" 1
LINE $drawing Line16 "Line16" $styles.default (15 632) (938 188)
POLY $drawing Polygon17 "Polygon17" $styles.default [ (14 631) (935 188) (925 864) (925 864) (9 873) (14 622) (16 628) ] 1
FILL Polygon17 "#ffffff" 1
FILL Polygon17 "#2c13ec" 1
RECT $drawing Rectangle18 "Rectangle18" $styles.default (97.5 694.5) 67 67
FILL Rectangle18 "#ffffff" 1
FILL Rectangle18 "#ddec0e" 1
FILL Rectangle18 "#e2ee44" 1
RECT $drawing Rectangle19 "Rectangle19" $styles.default (129.5 758) 79 68
FILL Rectangle19 "#ecec13" 1
CIRCLE $drawing Circle20 "Circle20" $styles.default (340 540) 38.07886552931954
CIRCLE $drawing Circle21 "Circle21" $styles.default (473 503) 36.24913792078372
CIRCLE $drawing Circle22 "Circle22" $styles.default (586 449) 40.22437072223753
CIRCLE $drawing Circle23 "Circle23" $styles.default (696 399) 38.48376280978771
CIRCLE $drawing Circle24 "Circle24" $styles.default (809 337) 36.89173349139343
FILL Circle24 "#eca013" 1
FILL Circle24 "#e89802" 1
FILL Circle23 "#ffa552" 1
FILL Circle23 "#e97407" 1
FILL Circle22 "#52ff5a" 1
FILL Circle21 "#ff52f6" 1
FILL Circle20 "#ffff52" 1
POLY $drawing Polygon27 "Polygon27" $styles.default [ (95 229) (37 278) (37 278) (89 338) (182 304) (95 227) (97 232) ] 1
POLY $drawing Polygon28 "Polygon28" $styles.default [ (188 191) (227 235) (300 221) (226 128) (189 191) (189 191) ] 1
POLY $drawing Polygon29 "Polygon29" $styles.default [ (57 67) (14 146) (95 194) (188 117) (57 65) (57 65) ] 1
POLY $drawing Polygon30 "Polygon30" $styles.default [ (275 41) (240 94) (331 160) (343 55) (273 43) (272 40) ] 1
POLY $drawing Polygon31 "Polygon31" $styles.default [ (408 49) (360 137) (436 149) (433 50) (408 51) (410 47) ] 1
POLY $drawing Polygon32 "Polygon32" $styles.default [ (512 42) (465 132) (606 81) (537 10) (507 51) (511 43) ] 1
FILL Polygon27 "#5dff52" 1
FILL Polygon28 "#52ff52" 1
FILL Polygon30 "#54ff52" 1
FILL Polygon31 "#52ff77" 1
FILL Polygon32 "#66ff52" 1
FILL Polygon29 "#7dff52" 1
POLY $drawing Polygon33 "Polygon33" $styles.default [ (9 565) (14 631) (938 186) (939 52) (8 569) (13 567) ] 1
FILL Polygon33 "#ff5a52" 1
FILL Polygon4 "#f6f19d" 1
FILL Polygon4 "#ede207" 1
FILL Polygon4 "#f9ef24" 1`;

        this.addOperations(code.split("\n").filter(l => !!l));
    }

}
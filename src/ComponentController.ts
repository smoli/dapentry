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
        this._interpreter.addOperation("FILL", GfxFill);
        this._interpreter.addOperation("STROKE", GfxStroke);

        const appModel = new JSONModel({
            code: [],
            segmentedCode: [],
            data: [],
            drawing: [],
            poi: [],
            selection: []
        });
        component.setModel(appModel, "appModel");
        // this.preloadDemoCode();
    }


    protected async runCode(): Promise<any> {
        const c = this.getAppModel().getProperty("/code");

        this._interpreter.parse(c);
        return this._interpreter.run({
            "$drawing": this.getAppModel().getProperty("/drawing"),
            "$styles": this._styleManager.styles
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
        this._updateDrawing();
    }

    async addOperation(code: string) {
        this.addCodeLine(code);
        await this.runCode();
        this._updateDrawing();
    }

    async addOperations(code: Array<string>) {
        code.forEach(c => this.addCodeLine(c));
        if (this._drawing) {
            await this.runCode();
            this._updateDrawing();
        }
    }

    /**
     * TODO: This is hacky
     * @param clearAllFirst
     * @protected
     */
    protected _updateDrawing(clearAllFirst: boolean = false) {
        this._drawing.update(clearAllFirst);
    }

    /**
     * TODO: this is hacky. We need to figure out a way to make the drawing control
     *       actually data driven.
     * @param value
     */
    public set drawing(value: Drawing) {
        this._drawing = value;
        this.runCode().then(() => {
            this._updateDrawing();
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
        const code = `RECT $drawing Rectangle1 "Rectangle1" $styles.default (323.5 497.5) 201 861
FILL Rectangle1 "#526fff" 1
FILL Rectangle1 "#526fff" 0.64
RECT $drawing Rectangle3 "Rectangle3" $styles.default (321.5 797) 81 232
FILL Rectangle3 "#fff652" 0.64
FILL Rectangle3 "#fff652" 0.86
MOVE Rectangle3 (2 16)
RECT $drawing Rectangle4 "Rectangle4" $styles.default (338.5 224.5) 45 103
FILL Rectangle4 "#fff652" 0.86
MOVE Rectangle4 (35 -2)
RECT $drawing Rectangle5 "Rectangle5" $styles.default (301 267) 42 102
FILL Rectangle5 "#6952ff" 0.86
FILL Rectangle5 "#0a0a0b" 0.86
MOVE Rectangle5 (-8 -45)
RECT $drawing Rectangle6 "Rectangle6" $styles.default (471 942.5) 938 23
FILL Rectangle6 "#7aff52" 0.86
STROKE Rectangle6 0
LINE $drawing Line7 "Line7" $styles.default (179 926) (180 846)
FILL Line7 "#52ff5a" 0.86
FILL Line7 "#05710a" 0.86
FILL Line7 "#079c0f" 0.86
CIRCLE $drawing Circle8 "Circle8" $styles.default (180 845) 11.180339887498949
FILL Line7 "#9c9c07" 0.86
FILL Line7 "#ebeb19" 0.86
FILL Line7 "#19eb32" 0.86
FILL Circle8 "#e75a27" 0.86
FILL Circle8 "#e72a27" 0.86
FILL Circle8 "#e81511" 0.86
FILL Circle8 "#dee811" 0.86
CIRCLE $drawing Circle10 "Circle10" $styles.default (175 829) 14.866068747318506
CIRCLE $drawing Circle11 "Circle11" $styles.default (198 835) 11.704699910719626
CIRCLE $drawing Circle12 "Circle12" $styles.default (192 858) 12.041594578792296
CIRCLE $drawing Circle13 "Circle13" $styles.default (172 862) 10.816653826391969
CIRCLE $drawing Circle14 "Circle14" $styles.default (160 847) 8.06225774829855
FILL Circle10 "#ff5a52" 0.86
FILL Circle10 "#ea251a" 0.86
FILL Circle11 "#ff5a52" 0.86
FILL Circle11 "#e63c33" 0.86
FILL Circle12 "#ff5a52" 0.86
FILL Circle12 "#d7271d" 0.86
FILL Circle13 "#ff5452" 0.86
FILL Circle13 "#d92926" 0.86
FILL Circle14 "#ff5a52" 0.86
FILL Circle14 "#e12d23" 0.86
RECT $drawing Rectangle15 "Rectangle15" $styles.default (525.5 733) 195 388
RECT $drawing Rectangle16 "Rectangle16" $styles.default (681.5 824.5) 115 205
RECT $drawing Rectangle17 "Rectangle17" $styles.default (825.5 657) 167 534
FILL Rectangle15 "#ffb752" 0.86
RECT $drawing Rectangle18 "Rectangle18" $styles.default (463.5 855) 71 138
FILL Rectangle18 "#52ff66" 0.86
FILL Rectangle18 "#15701f" 0.86
FILL Rectangle18 "#1d9f2c" 0.86
FILL Rectangle18 "#22b934" 0.86
RECT $drawing Rectangle20 "Rectangle20" $styles.default (555.5 609.5) 45 57
FILL Rectangle20 "#52ceff" 0.86
FILL Rectangle20 "#62cbf4" 0.86
FILL Rectangle16 "#ee52ff" 0.86
FILL Rectangle16 "#fff352" 0.86
RECT $drawing Rectangle22 "Rectangle22" $styles.default (716.5 902.5) 23 43
FILL Rectangle22 "#ff5283" 0.86
FILL Rectangle22 "#e70d4b" 0.86
FILL Rectangle22 "#e7320d" 0.86
FILL Rectangle22 "#e24a2c" 0.86
FILL Rectangle22 "#f0350f" 0.86
FILL Rectangle22 "#d83413" 0.86
FILL Rectangle22 "#f43610" 0.86
FILL Rectangle22 "#f24421" 0.86
CIRCLE $drawing Circle23 "Circle23" $styles.default (660 790) 19.4164878389476
CIRCLE $drawing Circle24 "Circle24" $styles.default (709 793) 19.1049731745428
FILL Circle23 "#0c0909" 0.86
FILL Circle24 "#150d0a" 0.86
FILL Rectangle17 "#ff52ff" 0.86
RECT $drawing Rectangle25 "Rectangle25" $styles.default (841 849.5) 84 141
FILL Rectangle25 "#52fff6" 0.86
CIRCLE $drawing Circle26 "Circle26" $styles.default (812 837) 7.211102550927978
FILL Circle26 "#fcff52" 0.86
RECT $drawing Rectangle28 "Rectangle28" $styles.default (796.5 485.5) 45 69
FILL Rectangle28 "#52b7ff" 0.86
FILL Rectangle28 "#a0d0f3" 0.86
RECT $drawing Rectangle29 "Rectangle29" $styles.default (863 483) 32 68
FILL Rectangle29 "#52cbff" 0.86
FILL Rectangle29 "#b1daec" 0.86
CIRCLE $drawing Circle30 "Circle30" $styles.default (910 17) 63.324560795950255
FILL Circle30 "#eeff52" 0.86
LINE $drawing Line31 "Line31" $styles.default (887 79) (845 201)
LINE $drawing Line32 "Line32" $styles.default (858 54) (776 107)
LINE $drawing Line33 "Line33" $styles.default (849 27) (718 39)
LINE $drawing Line34 "Line34" $styles.default (917 81) (890 218)
FILL Line33 "#f3ff52" 0.86
FILL Line32 "#fffc52" 0.86
FILL Line31 "#ffff52" 0.86
FILL Line34 "#fcff52" 0.86
STROKE Line34 9
STROKE Line34 6
STROKE Line31 6
STROKE Line32 6
STROKE Line33 6`;

        this.addOperations(code.split("\n").filter(l => !!l));
    }

}
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
    private _drawing:Drawing;

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
            selection: []
        });
        component.setModel(appModel, "appModel");
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

    private addCodeLineToSegmentedCode(codeLine: string): void {
        const tokens = Parser.parseLine(codeLine);
        const c = this.getAppModel().getProperty("/segmentedCode");
        c.push(tokens);
        this.getAppModel().setProperty("/segmentedCode", c);
    }

    private addCodeLine(codeLine: string): void {
        const c = this.getAppModel().getProperty("/code");
        c.push(codeLine);
        this.getAppModel().setProperty("/code", c);
        this.addCodeLineToSegmentedCode(codeLine);
    }

    async addOperation(code: string) {
        this.addCodeLine(code);
        await this.runCode();
        this._updateDrawing();
    }

    async addOperations(code: Array<string>) {
        code.forEach(c => this.addCodeLine(c));
        await this.runCode();
        this._updateDrawing();
    }

    /**
     * TODO: This is hacky
     * @param clearAllFirst
     * @protected
     */
    protected _updateDrawing(clearAllFirst:boolean = false) {
        this._drawing.update(clearAllFirst);
    }

    /**
     * TODO: this is hacky. We need to figure out a way to make the drawing control
     *       actually data driven.
     * @param value
     */
    public set drawing(value: Drawing) {
        this._drawing = value;
    }

    getSelection():Array<GrObject> {
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

}
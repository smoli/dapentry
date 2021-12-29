import Component from "./Component";
import JSONModel from "sap/ui/model/json/JSONModel";
import {Interpreter} from "./runtime/interpreter/Interpreter";
import {GfxCircle} from "./runtime/gfx/GfxCircle";
import {GfxRect} from "./runtime/gfx/GfxRect";
import {GfxMove} from "./runtime/gfx/GfxMove";

export class ComponentController {
    private _component: Component;
    private _interpreter: Interpreter;


    constructor(component:Component) {
        this._component = component;
        this._interpreter = new Interpreter();

        this._interpreter.addOperation("CIRCLE", GfxCircle);
        this._interpreter.addOperation("RECT", GfxRect);
        this._interpreter.addOperation("MOVE", GfxMove);

        const appModel = new JSONModel({
            code: [],
            data: [],
            drawing: [],
        });
        component.setModel(appModel, "appModel");
    }

    protected async runCode():Promise<any> {
        const c = this.getAppModel().getProperty("/code");

        this._interpreter.parse(c);
        return this._interpreter.run({
            "drawing": this.getAppModel().getProperty("/drawing")
        });
    }

    getAppModel():JSONModel {
        return this._component.getModel("appModel") as JSONModel;
    }

    private addCodeLine(codeLine:string):void {
        const c = this.getAppModel().getProperty("/code");
        c.push(codeLine);
        this.getAppModel().setProperty("/code", c);
    }

    async addOperation(code:string) {
        this.addCodeLine(code);
        return this.runCode();
    }

}
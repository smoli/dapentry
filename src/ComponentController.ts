import {GRCircle, GrObject, GRRectangle, ObjectType} from "./controls/Objects/GrObject";
import Component from "./Component";
import JSONModel from "sap/ui/model/json/JSONModel";
import {Interpreter} from "./runtime/interpreter/Interpreter";
import {GfxCircle} from "./runtime/gfx/GfxCircle";
import {GfxRect} from "./runtime/gfx/GfxRect";

export class ComponentController {
    private _component: Component;
    private _interpreter: Interpreter;


    constructor(component:Component) {
        this._component = component;
        this._interpreter = new Interpreter();

        this._interpreter.addOperation("CIRCLE", GfxCircle);
        this._interpreter.addOperation("RECT", GfxRect);

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

    async addObject(object:GrObject) {

        switch (object.type) {
            case ObjectType.Circle:
                const c = object as GRCircle;
                this.addCodeLine(`CIRCLE drawing ${object.name} "${object.name}" (${object.x} ${object.y}) ${c.r}`)
                break;
            case ObjectType.Rectangle:
                const r = object as GRRectangle;
                this.addCodeLine(`RECT drawing ${object.name} "${object.name}" (${object.x} ${object.y}) ${r.w} ${r.h}`)
                break;
            case ObjectType.Ellipse:
                break;
            case ObjectType.Square:
                break;
            case ObjectType.Line:
                break;

        }

        return this.runCode();
    }

}
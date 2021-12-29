import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import Drawing from "../controls/Drawing";
import {ComponentController} from "../ComponentController";
import Component from "../Component";

/**
 * @namespace sts.drawable.controller
 */
export default class DrawingController extends Controller {

    public onInit() : void {

        const viewModel = new JSONModel({
            currentTool: ""
        });

        this.getView().setModel(viewModel, "drawingViewModel")
    }

    private viewModel():JSONModel {
        return this.getView().getModel("drawingViewModel") as JSONModel;
    }

    getComponentController():ComponentController {
        return (this.getOwnerComponent() as Component).getComponentController();
    }

    protected _updateDrawing(clearAllFirst:boolean = false) {
        (this.byId("drawing") as Drawing).update(clearAllFirst);
    }

    onObjectDeleted(event) {
        const o = this.viewModel().getProperty("/objects");
        const i = o.indexOf(event.getParameter("object"));
        if (i !== -1) {
            o.splice(i, 1);
        }
        this.viewModel().setProperty("/objects", o);
        this._updateDrawing(true);

    }

    async onNewObject(event) {
        await this.getComponentController().addObject(event.getParameter("object"));
        this._updateDrawing();
    }
}
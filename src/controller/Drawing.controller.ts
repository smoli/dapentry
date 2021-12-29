import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import Drawing from "../controls/drawing/Drawing";
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

    onAfterRendering() {
        this.getComponentController().drawing = this.byId("drawing") as Drawing;
    }

    private viewModel():JSONModel {
        return this.getView().getModel("drawingViewModel") as JSONModel;
    }

    getComponentController():ComponentController {
        return (this.getOwnerComponent() as Component).getComponentController();
    }

    onObjectDeleted(event) {
        const o = this.viewModel().getProperty("/objects");
        const i = o.indexOf(event.getParameter("object"));
        if (i !== -1) {
            o.splice(i, 1);
        }
        this.viewModel().setProperty("/objects", o);
    }

    onSelectionChange(event) {
        this.getComponentController().setSelection(event.getParameter("selection"));
    }

    async onNewOperation(event) {
        await this.getComponentController().addOperation(event.getParameter("code"));
    }
}
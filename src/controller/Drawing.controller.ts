import JSONModel from "sap/ui/model/json/JSONModel";
import Drawing from "../controls/drawing/Drawing";
import BaseController from "./BaseController";

/**
 * @namespace sts.drawable.controller
 */
export default class DrawingController extends BaseController {

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
        if (event.getParameter("code")) {
            const code = event.getParameter("code");

            if (Array.isArray(code)) {
                await this.getComponentController().addOperations(code);
            } else {
                await this.getComponentController().addOperation(code);
            }
        }
    }

    onCodeLineChanged(event) {
        this.getComponentController().updateOperation(
            this.getAppModel().get("selectedCodeLine/index"),
            event.getParameter("tokenIndex"),
            event.getParameter("tokenSubIndex"),
            event.getParameter("newValue"));
    }

    onNextStep() {
        this.getComponentController().nextStep();
    }
}
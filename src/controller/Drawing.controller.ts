import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import Drawing from "../controls/Drawing";

/**
 * @namespace sts.drawable.controller
 */
export default class App extends Controller {

    public onInit() : void {

        const viewModel = new JSONModel({
            objects: []
        });

        this.getView().setModel(viewModel, "drawingViewModel")
    }

    private viewModel():JSONModel {
        return this.getView().getModel("drawingViewModel") as JSONModel;
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

    onNewObject(event) {
        const o = this.viewModel().getProperty("/objects");
        o.push(event.getParameter("object"));
        this.viewModel().setProperty("/objects", o);
        this._updateDrawing();
    }
}
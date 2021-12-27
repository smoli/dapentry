import Controller from "sap/ui/core/mvc/Controller";
import AppComponent from "../Component";
import JSONModel from "sap/ui/model/json/JSONModel";
import {GRCircle} from "../controls/Objects/GrObject";
import Drawing from "../controls/Drawing";

/**
 * @namespace sts.drawable.controller
 */
export default class App extends Controller {

    public onInit() : void {

        const viewModel = new JSONModel({
            objects: [new GRCircle(100, 100, 50)]
        });

        this.getView().setModel(viewModel, "drawingViewModel")
    }

    private viewModel():JSONModel {
        return this.getView().getModel("drawingViewModel") as JSONModel;
    }

    protected _updateDrawing() {
        (this.byId("drawing") as Drawing).update();
    }

    onNewObject(event) {
        const o = this.viewModel().getProperty("/objects");
        o.push(event.getParameter("object"));
        this.viewModel().setProperty("/objects", o);
        this._updateDrawing();
    }
}
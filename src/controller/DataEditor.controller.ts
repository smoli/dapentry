import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import Drawing from "../controls/drawing/Drawing";
import {ComponentController} from "../ComponentController";
import Component from "../Component";

/**
 * @namespace sts.drawable.controller
 */
export default class DataEditorController extends Controller {

    getComponentController():ComponentController {
        return (this.getOwnerComponent() as Component).getComponentController();
    }

    getAppModel():JSONModel {
        return this.getComponentController().getAppModel();
    }


    protected makeFieldName(prefix:string, d:Array<any>) {
        let n = 1;

        while (d.find(d => d.name === prefix + n)) {
            n++;
        }

        return prefix + n;

    }

    onNewDataField(event) {
        const d = this.getAppModel().getProperty("/data");
        d.push({ name: this.makeFieldName("f", d), value: 1 })
        this.getAppModel().setProperty("/data", d);
    }

    onDeleteDataField(event) {
        const ctx = event.getSource().getBindingContext("appModel");
        const nameToDelete = ctx.getProperty("name");
        let d = this.getAppModel().getProperty("/data");
        d = d.filter(d => d.name !== nameToDelete);
        this.getAppModel().setProperty("/data", d);
    }
}
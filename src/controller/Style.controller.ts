import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import Drawing from "../controls/drawing/Drawing";
import {ComponentController} from "../ComponentController";
import Component from "../Component";

/**
 * @namespace sts.drawable.controller
 */
export default class StyleController extends Controller {

    getComponentController():ComponentController {
        return (this.getOwnerComponent() as Component).getComponentController();
    }

    onColorChange(event) {

        const selection = this.getComponentController().getSelection();

        if (selection && selection.length) {
            const code = selection.map(object => {
                return `FILL ${object.name} "${event.getParameter("hex")}" ${event.getParameter("alpha")}`;
            });
            this.getComponentController().addOperations(code);
        }


    }
}
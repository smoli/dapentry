import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import {ComponentController} from "../ComponentController";
import Component from "../Component";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import {JSONModelAccess} from "../JSONModelAccess";

/**
 * @namespace sts.drawable.controller
 */
export default class BaseController extends Controller {

    getComponentController():ComponentController {
        return (this.getOwnerComponent() as Component).getComponentController();
    }

    getAppModel():JSONModelAccess {
        return this.getComponentController().getAppModel();
    }


    getResourceText(textId:string, ...parameters:Array<any>):string {
        const bundle:ResourceBundle = (this.getView().getModel("i18n") as ResourceModel).getResourceBundle() as ResourceBundle;
        return bundle.getText(textId, parameters);
    }

}
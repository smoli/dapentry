import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import {ComponentController} from "../ComponentController";
import Component from "../Component";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import {JSONModelAccess} from "../JSONModelAccess";
import {AppModel} from "../model/AppModel";
import {AppState} from "../model/AppState";
import {AppConfig} from "../../src/AppConfig";

/**
 * @namespace sts.drawable.controller
 */
export default class BaseController extends Controller {

    getComponentController():ComponentController {
        return (this.getOwnerComponent() as Component).getComponentController();
    }

    getAppState():AppState {
        return this.getComponentController().getAppState();
    }

    getAppModelName():string {
        return AppConfig.UICore.appModelName
    }


    getResourceText(textId:string, ...parameters:Array<any>):string {
        const bundle:ResourceBundle = (this.getView().getModel("i18n") as ResourceModel).getResourceBundle() as ResourceBundle;
        return bundle.getText(textId, parameters);
    }

}
import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import {ComponentController} from "../ComponentController";
import Component from "../Component";

/**
 * @namespace sts.drawable.controller
 */
export default class BaseController extends Controller {

    getComponentController():ComponentController {
        return (this.getOwnerComponent() as Component).getComponentController();
    }

    getAppModel():JSONModel {
        return this.getComponentController().getAppModel();
    }

}
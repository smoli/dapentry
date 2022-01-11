/**
 * Component module
 *
 * @module
 */

import UIComponent from "sap/ui/core/UIComponent";
import { support } from "sap/ui/Device";
import {ComponentController} from "./ComponentController";
import {CodeManager} from "./runtime/CodeManager";
import JSONModel from "sap/ui/model/json/JSONModel";
import {AppModel} from "./model/AppModel";


/**
 * App component
 * @namespace sts.drawable
 */
export default class Component extends UIComponent {
    public static metadata = {
        manifest: "json"
    };

    private contentDensityClass : string;
    private _appController: ComponentController;
    private _codeManager: CodeManager;
    private _appModel: AppModel;

    /**
     * Initialize component.
     */
    public init() : void {
        super.init();
        this.getRouter().initialize();

        this._codeManager = new CodeManager({
            LOAD: 1,
            ADD: 1,
            SUB: 1,
            CIRCLE: 1,
            RECT: 1
        });

        const appModel = new JSONModel({
            codeString: "",
            segmentedCode: [],
            selectedCodeLine: null,
            data: [ { name: "f1", value: [10, 20, 30, 40] }],
            drawing: [],
            poi: [],
            selection: []
        });
        this.setModel(appModel, "appModel");
        this._appModel = new AppModel(appModel, this._codeManager);

        this._appController = new ComponentController(this);
    }

    getCodeManager(): CodeManager {
        return this._codeManager;
    }

    getAppModel(): AppModel {
        return this._appModel;
    }

    getComponentController(): ComponentController {
        return this._appController;
    }

    /**
     * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
     * design mode class should be set, which influences the size appearance of some controls.
     *
     * @public
     * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
     */
    public getContentDensityClass() : string {
        if (this.contentDensityClass === undefined) {
            // check whether FLP has already set the content density class; do nothing in this case
            if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
                this.contentDensityClass = "";
            } else if (!support.touch) { // apply "compact" mode if touch is not supported
                this.contentDensityClass = "sapUiSizeCompact";
            } else {
                // "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
                this.contentDensityClass = "sapUiSizeCozy";
            }
        }
        return this.contentDensityClass;
    }

}

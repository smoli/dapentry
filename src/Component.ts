/**
 * Component module
 *
 * @module
 */

import UIComponent from "sap/ui/core/UIComponent";
import {support} from "sap/ui/Device";
import {ComponentController} from "./ComponentController";
import {CodeManager} from "./runtime/CodeManager";
import {AppModel} from "./model/AppModel";
import {Library, LibraryEntryArgumentType} from "./Library";
import {AspectRatio, GrCanvas} from "./Geo/GrCanvas";
import {AppConfig} from "./AppConfig";
import {AppState} from "./model/AppState";
import JSONModel from "sap/ui/model/json/JSONModel";
import {MockStatePersistence} from "./model/MockStatePersistence";

/**
 * App component
 * @namespace sts.drawable
 */
export default class Component extends UIComponent {
    public static metadata = {
        manifest: "json"
    };

    private contentDensityClass: string;
    private _appController: ComponentController;
    private _codeManager: CodeManager;
    private _appState: AppState;
    private _library: Library;

    /**
     * Initialize component.
     */
    public init(): void {
        super.init();
        this.getRouter().initialize();

        const model = new JSONModel();
        const _appModel = new AppModel(model);
        this._codeManager = _appModel.codeManager;
        this.setModel(model, AppConfig.UICore.appModelName);

        const persistence = new MockStatePersistence();
        this._appState = new AppState(_appModel, persistence);
        this._library = new Library(this._appState);

        this._appController = new ComponentController(this, GrCanvas.create_1_1(1000));

        this._appState.loadFromPersistence().then(() => { });
    }

    getLibrary(): Library {
        return this._library;
    }

    getCodeManager(): CodeManager {
        return this._codeManager;
    }

    getAppState(): AppState {
        return this._appState;
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
    public getContentDensityClass(): string {
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

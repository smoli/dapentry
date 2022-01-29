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


const starCode = `COMPOSITE o
LINE Line1, ${AppConfig.Runtime.defaultStyleRegisterName}, Canvas@bottom, Canvas@top
POLY Polygon1, ${AppConfig.Runtime.defaultStyleRegisterName}, [ Line1@end ], 1
DO spokes
ROTATE Line1, 180/ spokes
EXTPOLY Polygon1, [ Line1@(spokeRatio) ]
ROTATE Line1, 180 / spokes
EXTPOLY Polygon1, [ Line1@end ]
ENDDO
FILL Polygon1, "#fce654", 1
APP o.objects, Polygon1`;

const ngonCode = `COMPOSITE o
LINE Line1, ${AppConfig.Runtime.defaultStyleRegisterName}, Canvas@bottom, Canvas@top
POLY Polygon1, ${AppConfig.Runtime.defaultStyleRegisterName}, [ Line1@end ], 1
DO 5
ROTATE Line1, 360 / 5
EXTPOLY Polygon1, [ Line1@end ]
ENDDO
APP o.objects, Polygon1`;


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
        this._library = new Library(_appModel);
        this._appState = new AppState(_appModel);

        this._appController = new ComponentController(this, GrCanvas.create_1_1(1000));

        _appModel.addDataField({ name: "f1", value: [10, 20, 30, 40] });
        _appModel.addDataField({ name: "f2", value: 5 });


        this._library.addEntry({
            "id": "star",
            "name": "Star",
            "description": "not the celestial object",
            "author": "",
            "lastUpdate": null,
            "version": "",
            aspectRatio: AspectRatio.ar1_1,
            "arguments": {
                "spokes": {
                    "type": LibraryEntryArgumentType.Number,
                    "default": 5,
                    "description": "Number of spokes"
                },
                "spokeRatio": {
                    "type": LibraryEntryArgumentType.Number,
                    "default": 0.75,
                    "description": "Determines the length of the spokes"
                }
            },
            "code": starCode
        });

        this._library.addEntry({
            "id": "ngon",
            "name": "N-Gon",
            "description": "Gon with n corners",
            "author": "",
            lastUpdate: null,
            "version": "",
            aspectRatio: AspectRatio.ar1_1,
            "arguments": {
                "n": {
                    "type": LibraryEntryArgumentType.Number,
                    "default": 5,
                    "description": "Number of corners"
                }
            },
            "code": ngonCode
        });
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

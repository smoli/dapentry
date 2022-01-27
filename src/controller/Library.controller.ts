import Controller from "sap/ui/core/mvc/Controller";
import {ComponentController} from "../ComponentController";
import Component from "../Component";
import ColorPickerPopover from "sap/ui/unified/ColorPickerPopover";
import {ColorPickerMode} from "sap/ui/unified/library";
import Popover from "sap/m/Popover";
import Toolbar from "sap/m/Toolbar";
import Button from "sap/m/Button";
import ColorPicker from "sap/ui/unified/ColorPicker";
import {ButtonType, PlacementType} from "sap/m/library";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import BaseController from "./BaseController";
import {GrObject} from "../Geo/GrObject";
import {LibraryEntry} from "../Library";

/**
 * @namespace sts.drawable.controller
 */
export default class LibraryController extends BaseController {

    onLibraryEntrySelected(event) {
        const ctx = event.getSource().getBindingContext(this.getAppModelName());

        if (!ctx) {
            return;
        }

        const entry: LibraryEntry = ctx.getObject();

        if (!entry) {
            return;
        }

        this.getComponentController().insertLibraryEntry(entry);
    }

}
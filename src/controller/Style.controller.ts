import Controller from "sap/ui/core/mvc/Controller";
import {ComponentController} from "../ComponentController";
import Component from "../Component";
import ColorPickerPopover from "sap/ui/unified/ColorPickerPopover";
import {ColorPickerMode} from "sap/ui/unified/library";

/**
 * @namespace sts.drawable.controller
 */
export default class StyleController extends Controller {
    private fillColorPicker: ColorPickerPopover;
    private strokeColorPicker: ColorPickerPopover;

    getComponentController():ComponentController {
        return (this.getOwnerComponent() as Component).getComponentController();
    }

    onFillColorChange(event) {
        const selection = this.getComponentController().getSelection();

        if (selection && selection.length) {
            const code = selection.map(object => {
                return `FILL ${object.name}, "${event.getParameter("hex")}", ${event.getParameter("alpha")}`;
            });
            this.getComponentController().addOperations(code);
        }
    }

    onStrokeColorChange(event) {
        const selection = this.getComponentController().getSelection();

        if (selection && selection.length) {
            const code = selection.map(object => {
                // return `STROKECOLOR ${object.name}, "${event.getParameter("hex")}", ${event.getParameter("alpha")}`;
                const color = `rgba(${event.getParameter("r")}, ${event.getParameter("g")}, ${event.getParameter("b")}, ${event.getParameter("alpha")})`

                return `STROKECOLOR ${object.name}, "${color}"`;
            });
            this.getComponentController().addOperations(code);
        }
    }

    onFillColor(event) {
        if (!this.fillColorPicker) {
            this.fillColorPicker = new ColorPickerPopover("stsFillColorPickerPopover", {
                colorString: "{appModel>style/fillColor}",
                mode: ColorPickerMode.HSL,
                change: this.onFillColorChange.bind(this)
            });
        }
        this.fillColorPicker.openBy(event.getSource());
    }

    onStrokeColor(event) {
        if (!this.strokeColorPicker) {
            this.strokeColorPicker = new ColorPickerPopover("stsStrokeColorPickerPopover", {
                colorString: "{appModel>style/strokeColor}",
                mode: ColorPickerMode.HSL,
                change: this.onStrokeColorChange.bind(this)
            });
        }
        this.strokeColorPicker.openBy(event.getSource());
    }

    onStrokeWidthChange(event) {
        const selection = this.getComponentController().getSelection();

        if (selection && selection.length) {
            const code = selection.map(object => {
                return `STROKE ${object.name}, ${event.getParameter("value")}`;
            });
            this.getComponentController().addOperations(code);
        }
    }
}
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
import {AppConfig} from "../../src/core/AppConfig";
import {DragSession} from "sap/ui/core/dnd/DragAndDrop";
import {GrObject} from "../../src/geometry/GrObject";

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
        this.fillColorPicker.destroy();
        this.fillColorPicker = null;
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
        this.strokeColorPicker.destroy();
        this.strokeColorPicker = null;
    }

    onFillColor(event) {
        if (!this.fillColorPicker) {
            this.fillColorPicker = new ColorPickerPopover("stsFillColorPickerPopover", {
                colorString: "{appModel>style/fillColor}",
                mode: ColorPickerMode.HSL,
                change: this.onFillColorChange.bind(this),

            });
            this.fillColorPicker.openBy(event.getSource());
        } else {
            this.fillColorPicker.close();
            this.fillColorPicker.destroy();
            this.fillColorPicker = null;
        }
    }

    onStrokeColor(event) {
        if (!this.strokeColorPicker) {
            // this.strokeColorPicker = this.makeColorPickerPopOver("{appModel>style/strokeColor}");

            this.strokeColorPicker = new ColorPickerPopover("stsStrokeColorPickerPopover", {
                colorString: "{appModel>style/strokeColor}",
                mode: ColorPickerMode.HSL,
                change: this.onStrokeColorChange.bind(this)
            });
            this.strokeColorPicker.openBy(event.getSource());
        } else {
            this.strokeColorPicker.close();
            this.strokeColorPicker.destroy();
            this.strokeColorPicker = null;
        }
    }

    protected makePopOver(content):Popover {
        return new Popover({
            footer: new Toolbar({
                content: [
                    new ToolbarSpacer(),
                    new Button({
                        text: "OK",
                        type: ButtonType.Emphasized
                    })
                ]
            }),
            content: [content],
            placement: PlacementType.Bottom,
            showHeader: false
        });
    }

    protected makeColorPickerPopOver(forValue: string):Popover {
        return this.makePopOver(new ColorPicker({
            colorString: "{appModel>style/strokeColor}",
            mode: ColorPickerMode.HSL
        }))
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

    onPropertyDrag(event) {
        const src = event.getSource();
        const ctx = src.getBindingContext(AppConfig.UICore.appModelName);

        const objPath = ctx.getPath().split("/").filter((a,i) => i < 4).join("/");
        const obj =  ctx.getModel().getProperty(objPath);

        const session = event.getParameter("dragSession") as DragSession;

        session.setData("objectId", obj.uniqueName);
        session.setData("propertyName", ctx.getProperty("name"));
        session.setData("propertyValue", ctx.getProperty("value"));

    }
}
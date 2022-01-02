import BaseController from "./BaseController";
import HBox from "sap/m/HBox";
import Button from "sap/m/Button";
import {ButtonType, FlexAlignItems, FlexJustifyContent, FlexRendertype, FlexWrap, InputType} from "sap/m/library";
import Text from "sap/m/Text";
import Input from "sap/m/Input";
import FlexItemData from "sap/m/FlexItemData";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace sts.drawable.controller
 */
export default class DataEditorController extends BaseController {

    protected makeFieldName(prefix: string, d: Array<any>) {
        let n = 1;

        while (d.find(d => d.name === prefix + n)) {
            n++;
        }

        return prefix + n;

    }

    onNewDataField(event) {
        const d = this.getAppModel().getProperty("/data");
        d.push({name: this.makeFieldName("f", d), value: 1})
        this.getAppModel().setProperty("/data", d);
    }

    onDeleteDataField(event) {
        const ctx = event.getSource().getBindingContext("appModel");
        const nameToDelete = ctx.getProperty("name");
        let d = this.getAppModel().getProperty("/data");
        d = d.filter(d => d.name !== nameToDelete);
        this.getAppModel().setProperty("/data", d);
    }

    onFieldValueChanged() {
        this.getComponentController().updateAll();
    }

    onMakeList(event) {
        const ctx = event.getSource().getBindingContext("appModel");
        const v = ctx.getProperty("value");

        if (Array.isArray(v)) {

        } else {
            const m:JSONModel = ctx.getModel();
            m.setProperty("value", [v, 2], ctx);
            m.refresh(true);
        }
    }

    onAddValueToList(event) {
        const ctx = event.getSource().getBindingContext("appModel");
        const d = ctx.getProperty("value");
        d.push(23);
        ctx.getModel().setProperty("value", d, ctx);
    }

    fieldUIFactory(id, context) {
        if (Array.isArray(context.getProperty("value"))) {
            return this.makeListUI(id, context);
        } else {
            return this.makeFieldUI(id, context);
        }
    }

    makeFieldUI(id, context) {
        const b1 = new Button({type: ButtonType.Transparent, text: "-", press: this.onDeleteDataField.bind(this)});
        const t = new Text({text: "{appModel>name} ="});
        const i = new Input({
            value: "{appModel>value}",
            type: InputType.Number,
            change: this.onFieldValueChanged.bind(this),
            layoutData: new FlexItemData({growFactor: 0})
        });
        const b2 = new Button({type: ButtonType.Transparent, text: "+", press: this.onMakeList.bind(this)});

        b1.addStyleClass("sapUiNoMargin");
        t.addStyleClass("sapUiNoMarginTop");
        t.addStyleClass("sapUiNoMarginBottom");
        i.addStyleClass("sapUiNoMargin");
        b2.addStyleClass("sapUiNoMargin");

        const h = new HBox(id, {
            items: [b1, t, i, b2],
            justifyContent: FlexJustifyContent.Center,
            alignItems: FlexAlignItems.Center
        });

        h.addStyleClass("sapUiNoMargin")
        return h;
    }

    makeListUI(id, context) {
        const b1 = new Button({type: ButtonType.Transparent, text: "-", press: this.onDeleteDataField.bind(this)});
        const t = new Text({text: "{appModel>name} ="});

        const inputTemplate = new Input({
            value: `{appModel>}`,
            type: InputType.Number,
            width: "4em",
            change: this.onFieldValueChanged.bind(this),
            layoutData: new FlexItemData({growFactor: 0})
        });
        inputTemplate.addStyleClass("sapUiNoMargin");
        const inputs = new HBox({
            items: { path: "appModel>value", template: inputTemplate },
            justifyContent: FlexJustifyContent.Center
        })
        inputs.addStyleClass("sapUiNoMargin");

        const b2 = new Button({type: ButtonType.Transparent, text: "+", press: this.onAddValueToList.bind(this)});

        b1.addStyleClass("sapUiNoMargin");
        t.addStyleClass("sapUiNoMarginTop");
        t.addStyleClass("sapUiNoMarginBottom");
        b2.addStyleClass("sapUiNoMargin");

        const h = new HBox(id, {
            renderType:FlexRendertype.Bare,
            wrap: FlexWrap.NoWrap,
            items: [b1, t, inputs, b2],
            justifyContent: FlexJustifyContent.Start,
            alignItems: FlexAlignItems.Center
        });

        h.addStyleClass("sapUiNoMargin")
        return h;
    }
}
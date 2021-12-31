import BaseController from "./BaseController";

/**
 * @namespace sts.drawable.controller
 */
export default class DataEditorController extends BaseController {

    protected makeFieldName(prefix:string, d:Array<any>) {
        let n = 1;

        while (d.find(d => d.name === prefix + n)) {
            n++;
        }

        return prefix + n;

    }

    onNewDataField(event) {
        const d = this.getAppModel().getProperty("/data");
        d.push({ name: this.makeFieldName("f", d), value: 1 })
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
}
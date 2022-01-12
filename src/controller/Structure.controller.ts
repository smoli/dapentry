import BaseController from "./BaseController";

/**
 * @namespace sts.drawable.controller
 */
export default class StructureController extends BaseController {


    onCodeChanged(event) {
        const code = event.getParameter("value");
        this.getComponentController().replaceCode(code.split("\n").filter(a => a.length !== 0)).then();
    }

    onStepSelectionChange(event) {
        const selection = event.getParameter("selection");

        if (selection.length === 0) {
            this.getComponentController().setSelectedCodeLine()
        } else {
            const step = selection[0]
            this.getComponentController().setSelectedCodeLine(step.getBindingContext("appModel").getProperty("index"));
        }

    }
}

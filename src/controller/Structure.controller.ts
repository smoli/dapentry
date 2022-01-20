import BaseController from "./BaseController";

/**
 * @namespace sts.drawable.controller
 */
export default class StructureController extends BaseController {


    onCodeChanged(event) {
        const code = event.getParameter("value");
        this.getComponentController().replaceCode(code.split("\n").filter(a => a.length !== 0)).then();
    }

    async onStepSelectionChange(event) {
        const selection = event.getParameter("selection");

        if (selection.length === 0) {
            await this.getComponentController().setSelectedCodeLines()
        } else {
            const indexes = selection.map(step => step.getBindingContext("appModel").getProperty("index"));
            await this.getComponentController().setSelectedCodeLines(indexes);
        }
    }
}

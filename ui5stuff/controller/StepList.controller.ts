import BaseController from "./BaseController";

/**
 * @namespace sts.drawable.controller
 */
export default class StepListController extends BaseController {

    async onStepSelectionChange(event) {
        const selection = event.getParameter("selection");

        if (selection.length === 0) {
            await this.getComponentController().setSelectedCodeLines()
        } else {
            const indexes = selection.map(step => step.getBindingContext("appModel").getProperty("index"));
            await this.getComponentController().setSelectedCodeLines(indexes);
        }
    }

    async onLoopPressed() {
        await this.getComponentController().wrapSelectionInLoop();
    }
}

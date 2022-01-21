import BaseController from "./BaseController";

/**
 * @namespace sts.drawable.controller
 */
export default class CodeEditorController extends BaseController {


    onCodeChanged(event) {
        const code = event.getParameter("value");
        this.getComponentController().replaceCode(code.split("\n").filter(a => a.length !== 0)).then();
    }

}

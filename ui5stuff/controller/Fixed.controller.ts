import BaseController from "./BaseController";
import {AspectRatio} from "../../src/geometry/GrCanvas";

/**
 * @namespace sts.drawable.controller
 */
export default class CodeEditorController extends BaseController {


    onAspectRatio1_1() {
        this.getComponentController().setAspectRatio(AspectRatio.ar1_1);
    }

    onAspectRatio3_2() {
        this.getComponentController().setAspectRatio(AspectRatio.ar3_2);
    }

    onAspectRatio4_3() {
        this.getComponentController().setAspectRatio(AspectRatio.ar4_3);
    }

    onAspectRatio16_9() {
        this.getComponentController().setAspectRatio(AspectRatio.ar16_9);
    }

    onAspectRatio16_10() {
        this.getComponentController().setAspectRatio(AspectRatio.ar16_10);
    }

    onCodeChanged(event) {
        const code = event.getParameter("value");
        this.getComponentController().replaceCode(code.split("\n").filter(a => a.length !== 0)).then();
    }

}

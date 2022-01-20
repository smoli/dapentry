import Component from "../../Component";
import {Parser} from "../../runtime/interpreter/Parser";
import {BaseAction} from "./BaseAction";
import {GrObject} from "../../Geo/GrObject";
import {SegmentedCodeLine} from "../../SegmentedCodeLine";


/*

    This was the code from the component controller that halts at the second iteration of a loop. Do we still need this?
        this.getAppModel().set("segmentedCode", c => c.index === index, "selected").to(true);
            const line = this.getAppModel().get("segmentedCode", c => c.index === index);
            this.getAppModel().set("selectedCodeLine").to(line);

            const code = this.getAppModel().get("segmentedCode");
            let inEach = false;
            let i = code.findIndex(c => c.index === index);
            while(i--) {
                if (code[i].tokens[0].value === "EACH") {
                    inEach = true;
                    break;
                }
                if (code[i].tokens[0].value === "ENDEACH") {
                    break;
                }
            }

 */

export class SetSelectedCodeLines extends BaseAction {
    private readonly _indexes: Array<number>;

    constructor(component: Component, indexes: Array<number>) {
        super(component);
        this._indexes = indexes;
    }

    _execute() {
        this.appModel.setSelectedCodeLines(this._indexes);
    }
}
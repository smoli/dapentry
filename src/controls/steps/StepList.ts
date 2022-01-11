import Control from "sap/ui/core/Control";

export class StepList extends Control {

    static readonly metadata = {
        properties: {
            text: { type: "string" },
            selected: { type: "boolean" }
        },

        events: {

            press: {
            }
        },

        aggregations: {
            steps: { type: "sts.drawable.controls.step.step", multiple: true }
        }
    }


}
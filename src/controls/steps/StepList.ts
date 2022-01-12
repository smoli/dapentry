import Control from "sap/ui/core/Control";
import Step from "./Step";

/**
 *
 * See https://github.com/SAP-samples/ui5-typescript-helloworld/tree/custom-controls
 *
 * @namespace sts.drawable.controls.steps
 */
export default class StepList extends Control {

    static readonly metadata = {
        properties: {
            text: {type: "string"}
        },

        events: {
            selectionChange: { selection: "Array"}
        },

        aggregations: {
            steps: {type: "sts.drawable.controls.steps.Step", multiple: true}
        }


    }

    // The following three lines were generated and should remain as-is to make TypeScript aware of the constructor signatures
    constructor(idOrSettings?: string | $StepListSettings);
    constructor(id?: string, settings?: $StepListSettings);
    constructor(id?: string, settings?: $StepListSettings) {
        super(id, settings);
    }


    protected singleSelect(id):Array<Step> {
        const selection = [];
        this.getSteps().forEach(step => {
            if (step.getId() === id) {
                const newState = !step.getSelected();
                step.setSelected(newState);
                if (newState) {
                    selection.push(step);
                }
            } else if (step.getSelected()) {
                step.setSelected(false);
            }
        });

        return selection;
    }

    onclick(event) {
        const id = event.target.getAttribute("id"); // ID of the clicked step
        const step:Step = this.getSteps().find(s => s.getId() === id);

        if (step) {
            // The user clicked on a step
            const newSelection = this.singleSelect(id);

            this.fireSelectionChange({ selection: newSelection });
        }
    }

}
import Control from "sap/ui/core/Control";

/**
 *
 * See https://github.com/SAP-samples/ui5-typescript-helloworld/tree/custom-controls
 *
 * @namespace sts.drawable.controls.step
 */
export default class Step extends Control {

    static readonly metadata = {
        properties: {
            text: { type: "string" },
            selected: { type: "boolean" },
            level: { type: "number", defaultValue: 0 }
        },

        events: {
            press: {
            }
        }
    }

    // The following three lines were generated and should remain as-is to make TypeScript aware of the constructor signatures
    constructor(idOrSettings?: string | $StepSettings);
    constructor(id?: string, settings?: $StepSettings);
    constructor(id?: string, settings?: $StepSettings) { super(id, settings); }

}
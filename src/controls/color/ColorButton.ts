import Button from "sap/m/Button";

/**
 *
 * See https://github.com/SAP-samples/ui5-typescript-helloworld/tree/custom-controls
 *
 * @namespace sts.drawable.controls.color
 */
export default class ColorButton extends Button {
    static readonly metadata = {
        properties: {
            color: { type: "string" }
        }
    }

    // The following three lines were generated and should remain
    // as-is to make TypeScript aware of the constructor signatures
    constructor(idOrSettings?: string | $ColorButtonSettings);
    constructor(id?: string, settings?: $ColorButtonSettings);
    constructor(id?: string, settings?: $ColorButtonSettings) {
        super(id, settings); }

}
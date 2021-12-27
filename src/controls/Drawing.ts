import Control from "sap/ui/core/Control";
import Button from "sap/m/Button";


/**
 * @namespace sts.drawable.controls
 */
export default class Drawing extends Control {

    static readonly metadata = {
        properties: {
            objects: {type: "any"}
        }
    }

    // The following three lines were generated and should remain as-is to make TypeScript aware of the constructor signatures
    constructor(idOrSettings?: string | $DrawingSettings);
    constructor(id?: string, settings?: $DrawingSettings);
    constructor(id?: string, settings?: $DrawingSettings) { super(id, settings); }

}
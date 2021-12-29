import Control from "sap/ui/core/Control";
import HBox from "sap/m/HBox";

/**
 *
 * See https://github.com/SAP-samples/ui5-typescript-helloworld/tree/custom-controls
 *
 * @namespace sts.drawable.controls
 */
export default class OperationEditor extends HBox {

    static readonly metadata = {
    }

// The following three lines were generated and should remain as-is to make TypeScript aware of the constructor signatures
    constructor(idOrSettings?: string | $OperationEditorSettings);
    constructor(id?: string, settings?: $OperationEditorSettings);
    constructor(id?: string, settings?: $OperationEditorSettings) { super(id, settings); }


}
import Text from "sap/m/Text";

/**
 *
 * See https://github.com/SAP-samples/ui5-typescript-helloworld/tree/custom-controls
 *
 * @namespace sts.drawable.controls.general
 */
export default class DraggableText extends Text {
    static readonly metadata = {
        dnd: true
    }
}
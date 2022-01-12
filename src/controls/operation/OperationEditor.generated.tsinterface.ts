import Event from "sap/ui/base/Event";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./OperationEditor" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $OperationEditorSettings extends $ControlSettings {
        tokens?: any;
        change?: (event: Event) => void;
    }

    export default interface OperationEditor {

        // property: tokens
        getTokens(): any;
        setTokens(tokens: any): this;

        // event: change
        attachChange(fn: (event: Event) => void, listener?: object): this;
        attachChange<CustomDataType extends object>(data: CustomDataType, fn: (event: Event, data: CustomDataType) => void, listener?: object): this;
        detachChange(fn: (event: Event) => void, listener?: object): this;
        fireChange(parameters?: object): this;
    }
}

import Event from "sap/ui/base/Event";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./Drawing" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $DrawingSettings extends $ControlSettings {
        objects?: any;
        newOperation?: (event: Event) => void;
        selectionChange?: (event: Event) => void;
        objectDeleted?: (event: Event) => void;
    }

    export default interface Drawing {

        // property: objects
        getObjects(): any;
        setObjects(objects: any): this;

        // event: newOperation
        attachNewOperation(fn: (event: Event) => void, listener?: object): this;
        attachNewOperation<CustomDataType extends object>(data: CustomDataType, fn: (event: Event, data: CustomDataType) => void, listener?: object): this;
        detachNewOperation(fn: (event: Event) => void, listener?: object): this;
        fireNewOperation(parameters?: object): this;

        // event: selectionChange
        attachSelectionChange(fn: (event: Event) => void, listener?: object): this;
        attachSelectionChange<CustomDataType extends object>(data: CustomDataType, fn: (event: Event, data: CustomDataType) => void, listener?: object): this;
        detachSelectionChange(fn: (event: Event) => void, listener?: object): this;
        fireSelectionChange(parameters?: object): this;

        // event: objectDeleted
        attachObjectDeleted(fn: (event: Event) => void, listener?: object): this;
        attachObjectDeleted<CustomDataType extends object>(data: CustomDataType, fn: (event: Event, data: CustomDataType) => void, listener?: object): this;
        detachObjectDeleted(fn: (event: Event) => void, listener?: object): this;
        fireObjectDeleted(parameters?: object): this;

        // event: nextStep
        attachNextStep(fn: (event: Event) => void, listener?: object): this;
        attachNextStep<CustomDataType extends object>(data: CustomDataType, fn: (event: Event, data: CustomDataType) => void, listener?: object): this;
        detachNextStep(fn: (event: Event) => void, listener?: object): this;
        fireNextStep(parameters?: object): this;

        // event: previousStep
        attachPreviousStep(fn: (event: Event) => void, listener?: object): this;
        attachPreviousStep<CustomDataType extends object>(data: CustomDataType, fn: (event: Event, data: CustomDataType) => void, listener?: object): this;
        detachPreviousStep(fn: (event: Event) => void, listener?: object): this;
        firePreviousStep(parameters?: object): this;
    }
}

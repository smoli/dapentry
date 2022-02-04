import Step from "./Step";
import Event from "sap/ui/base/Event";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./StepList" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $StepListSettings extends $ControlSettings {
        text?: string;
        steps?: Step[] | Step;
        selectionChange?: (event: Event) => void;
    }

    export default interface StepList {

        // property: text
        getText(): string;
        setText(text: string): this;

        // aggregation: steps
        getSteps(): Step[];
        addStep(steps: Step): this;
        insertStep(steps: Step, index: number): this;
        removeStep(steps: number | string | Step): this;
        removeAllSteps(): Step[];
        indexOfStep(steps: Step): number;
        destroySteps(): this;

        // event: selectionChange
        attachSelectionChange(fn: (event: Event) => void, listener?: object): this;
        attachSelectionChange<CustomDataType extends object>(data: CustomDataType, fn: (event: Event, data: CustomDataType) => void, listener?: object): this;
        detachSelectionChange(fn: (event: Event) => void, listener?: object): this;
        fireSelectionChange(parameters?: object): this;
    }
}
